// Business service for fetching business data
// axios is on the global window object for async data (local JSON fallback)
import axios from 'axios';
import Parse from './parseService.js';

// path to JSON data (fallback)
const DATA_URL = "/local_business_data.json";

// Helper: fetch from local JSON
const fetchLocalBusinesses = () => {
  return axios
    .get(DATA_URL)
    .then((res) => res.data[0]) // because local JSON has outer array
    .catch((err) => {
      console.error('Local GET Error:', err);
      return [];
    });
};

// Get all businesses: query Parse 'Business' class, fallback to local JSON
export const getAllBusinesses = async () => {
  try {
    const Business = Parse.Object.extend('Business');
    const query = new Parse.Query(Business);
    query.limit(1000); // adjust limit as needed
    
    const results = await query.find();
    console.log(`Successfully fetched ${results.length} businesses from Back4App`);
    
    // map Parse Objects to plain JS objects matching the local JSON shape
    return results.map((obj) => ({
      Name: obj.get('Name'),
      Category: obj.get('Category'),
      Keywords: obj.get('Keywords'),
      Address: obj.get('Address'),
      Addresses: obj.get('Addresses'),
      // include other fields if present
      ...obj.toJSON(),
    }));
  } catch (err) {
    console.warn('Parse query failed, falling back to local JSON:', err);
    console.error('Error details:', err.message, err.code);
    return fetchLocalBusinesses();
  }
};

// filter businesses by keyword (uses getAllBusinesses)
export const getBusinessesByKeyword = async (keyword) => {
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

// Filter businesses by category
export const getBusinessesByCategory = async (category) => {
  const businesses = await getAllBusinesses();
  if (!businesses) return [];
  return businesses.filter(
    (b) => String(b.Category || '').toLowerCase() === category.toLowerCase()
  );
};
