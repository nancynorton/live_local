// Business service for fetching business data
// axios is on the global window object for async data (local JSON fallback)
import axios from 'axios';
// use the new Business model helpers for Parse queries
import {
  fetchAll as fetchAllBusinesses,
  findByKeyword as findBusinessesByKeyword,
  findByCategory as findBusinessesByCategory,
  findById,
} from '../models/Business.js';

// path to JSON data (fallback)
const DATA_URL = "/local_business_data.json";

// helper: fetch from local JSON (used as fallback)
// local json is useful during development when Parse is not reachable
const fetchLocalBusinesses = () => {
  return axios
    .get(DATA_URL)
    .then((res) => res.data[0]) // local JSON contains an outer array
    .catch((err) => {
      console.error('Local GET Error:', err);
      return [];
    });
};

// Get all businesses: attempt Parse query, fallback to local JSON on any error.
// Returns: Promise<Array<Object>> where each object has at least { Name, Category, Keywords, Address }
export const getAllBusinesses = async () => {
  try {
    // BusinessModel.fetchAll returns Parse.Object[]
  const results = await fetchAllBusinesses();
    console.log(`Successfully fetched ${results.length} businesses from Back4App`);

    // Map Parse.Object to plain JS object expected by components
    const normalizeImage = (img) => {
      if (!img) return null;
      try {
        if (typeof img === 'string') return img;
        if (img.url && typeof img.url === 'function') return img.url();
        if (img._url) return img._url;
      } catch (e) {
        // ignore
      }
      return null;
    };

    return results.map((obj) => ({
      Name: obj.get ? obj.get('Name') : obj.Name,
      Category: obj.get ? obj.get('Category') : obj.Category,
      Keywords: obj.get ? obj.get('Keywords') : obj.Keywords,
      Address: obj.get ? obj.get('Address') : obj.Address,
      Addresses: obj.get ? obj.get('Addresses') : obj.Addresses,
      Image: normalizeImage(obj.get ? obj.get('Image') : (obj.Image || obj.image || null)),
      objectId: obj.toJSON ? obj.toJSON().objectId : undefined,
      // include any other fields from toJSON (objectId, createdAt etc.)
      ...obj.toJSON ? obj.toJSON() : obj,
    }));
  } catch (err) {
    // if Parse is unavailable (network, auth, CLP), fall back to local JSON file.
    console.warn('Parse query failed, falling back to local JSON:', err);
    console.error('Error details:', err.message, err.code);
    return fetchLocalBusinesses();
  }
};

// filter businesses by keyword (uses a Parse query, fallback to local filter)
// - Primary path: BusinessModel.findByKeyword(keyword) returns Parse.Object[]
// - Fallback: fetchAllBusinesses + JS filtering
export const getBusinessesByKeyword = async (keyword) => {
  try {
    console.log('Searching Parse with keyword:', keyword);
    const results = await findBusinessesByKeyword(keyword);
    console.log('Parse returned results:', results.length);
    results.forEach(obj => console.log('Found:', obj.get('Name'), 'Keywords:', obj.get('Keywords')));
    
    const normalizeImage = (img) => {
      if (!img) return null;
      try {
        if (typeof img === 'string') return img;
        if (img.url && typeof img.url === 'function') return img.url();
        if (img._url) return img._url;
      } catch (e) {
        // ignore
      }
      return null;
    };

    const mapped = results.map((obj) => ({
      Name: obj.get ? obj.get('Name') : obj.Name,
      Category: obj.get ? obj.get('Category') : obj.Category,
      Keywords: obj.get ? obj.get('Keywords') : obj.Keywords,
      Address: obj.get ? obj.get('Address') : obj.Address,
      Addresses: obj.get ? obj.get('Addresses') : obj.Addresses,
      Image: normalizeImage(obj.get ? obj.get('Image') : (obj.Image || obj.image || null)),
      objectId: obj.toJSON ? obj.toJSON().objectId : undefined,
      ...obj.toJSON ? obj.toJSON() : obj,
    }));

    // If Parse returned results, use them. If Parse returned an empty array, fall back to local filtering
    if (Array.isArray(mapped) && mapped.length > 0) return mapped;
    // fall through to local filtering below
  } catch (err) {
    // Log detailed Parse error information
    console.warn('Parse query failed:', {
      error: err.message,
      code: err.code,
      stack: err.stack
    });
    const businesses = await getAllBusinesses();
    if (!businesses) return [];
    // Prepare variations of the keyword (singular/plural)
    const keywordLower = keyword.toLowerCase();
    const keywordSingular = keywordLower.endsWith('s') ? keywordLower.slice(0, -1) : keywordLower;
    const keywordPlural = keywordLower.endsWith('s') ? keywordLower : keywordLower + 's';
    
    return businesses.filter((b) => {
      if (!b.Keywords) return false;

      if (Array.isArray(b.Keywords)) {
        return b.Keywords.some((k) => {
          const kLower = String(k).toLowerCase();
          return kLower === keywordLower || 
                 kLower === keywordSingular || 
                 kLower === keywordPlural || 
                 kLower.includes(keywordLower);
        });
      }

      const bKeywordsLower = String(b.Keywords).toLowerCase();
      return bKeywordsLower.includes(keywordLower) || 
             bKeywordsLower.includes(keywordSingular) || 
             bKeywordsLower.includes(keywordPlural);
    });
  }
  // If the Parse path didn't throw but returned zero results, do the same local fallback
  const businesses = await getAllBusinesses();
  if (!businesses) return [];
  return businesses.filter((b) => {
    if (!b.Keywords) return false;

    if (Array.isArray(b.Keywords)) {
      return b.Keywords.some((k) =>
        String(k).toLowerCase().includes(keyword.toLowerCase())
      );
    }

    return String(b.Keywords).toLowerCase().includes(keyword.toLowerCase());
  });
};

/**
 * getBusinessById(id)
 * - Tries Parse first (findById). If that fails or id is not a parse id, falls back to the local JSON
 * - Accepts either a Parse objectId or an encoded Name used for local fallback
 */
export const getBusinessById = async (id) => {
  if (!id) throw new Error('Missing id');

  // try Parse path first
  try {
    const obj = await findById(id);
    if (obj) {
      return {
        Name: obj.get ? obj.get('Name') : obj.Name,
        Category: obj.get ? obj.get('Category') : obj.Category,
        Keywords: obj.get ? obj.get('Keywords') : obj.Keywords,
        Address: obj.get ? obj.get('Address') : obj.Address,
        Addresses: obj.get ? obj.get('Addresses') : obj.Addresses,
        Image: obj.get ? obj.get('Image') : (obj.Image || obj.image || null),
        objectId: obj.toJSON ? obj.toJSON().objectId : undefined,
        ...obj.toJSON ? obj.toJSON() : obj,
      };
    }
  } catch (e) {
    // ignore parse errors and fall back to local
    console.warn('getBusinessById parse lookup failed, falling back to local json', e.message || e);
  }

  // fallback: try local JSON by matching encoded name or Name
  try {
    const res = await fetchLocalBusinesses();
    // res is the array of businesses
    const list = Array.isArray(res) ? res : (res && res[0]) ? res[0] : [];
    // id may be encoded name
    const decoded = decodeURIComponent(id);
    const found = list.find((b) => b.Name === decoded || b.Name === id || b.objectId === id);
    return found || null;
  } catch (e) {
    console.error('Local fallback getBusinessById failed', e);
    return null;
  }
};

// Filter businesses by category
// - Primary: use BusinessModel.findByCategory which performs an exact, case-insensitive regex match
// - Fallback: filter local dataset (local json)
export const getBusinessesByCategory = async (category) => {
  try {
  const results = await findBusinessesByCategory(category);
    return results.map((obj) => ({
      Name: obj.get ? obj.get('Name') : obj.Name,
      Category: obj.get ? obj.get('Category') : obj.Category,
      Keywords: obj.get ? obj.get('Keywords') : obj.Keywords,
      Address: obj.get ? obj.get('Address') : obj.Address,
      Addresses: obj.get ? obj.get('Addresses') : obj.Addresses,
        Image: (function(img){
          if (!img) return null;
          try{
            if (typeof img === 'string') return img;
            if (img.url && typeof img.url === 'function') return img.url();
            if (img._url) return img._url;
          }catch(e){}
          return null;
        })(obj.get ? obj.get('Image') : (obj.Image || obj.image || null)),
      objectId: obj.toJSON ? obj.toJSON().objectId : undefined,
      ...obj.toJSON ? obj.toJSON() : obj,
    }));
  } catch (err) {
    console.warn('Category Parse query failed, falling back to local filter:', err);
    const businesses = await getAllBusinesses();
    if (!businesses) return [];
    return businesses.filter(
      (b) => String(b.Category || '').toLowerCase() === category.toLowerCase()
    );
  }
};
