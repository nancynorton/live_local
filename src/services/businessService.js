// Business service for fetching business data
// axios is on the global window object for async data (local JSON fallback)
import axios from 'axios';
// use the new Business model helpers for Parse queries
import {
  fetchAll as fetchAllBusinesses,
  findByKeyword as findBusinessesByKeyword,
  findByCategory as findBusinessesByCategory,
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
    return results.map((obj) => ({
      Name: obj.get ? obj.get('Name') : obj.Name,
      Category: obj.get ? obj.get('Category') : obj.Category,
      Keywords: obj.get ? obj.get('Keywords') : obj.Keywords,
      Address: obj.get ? obj.get('Address') : obj.Address,
      Addresses: obj.get ? obj.get('Addresses') : obj.Addresses,
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
  const results = await findBusinessesByKeyword(keyword);
    return results.map((obj) => ({
      Name: obj.get ? obj.get('Name') : obj.Name,
      Category: obj.get ? obj.get('Category') : obj.Category,
      Keywords: obj.get ? obj.get('Keywords') : obj.Keywords,
      Address: obj.get ? obj.get('Address') : obj.Address,
      Addresses: obj.get ? obj.get('Addresses') : obj.Addresses,
      ...obj.toJSON ? obj.toJSON() : obj,
    }));
  } catch (err) {
    // Log the parse-level error and attempt the local filtering fallback
    console.warn('Keyword Parse query failed, falling back to local filter:', err);
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
