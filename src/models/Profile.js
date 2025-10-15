// Profile model helpers — small set of Parse helpers for Profile objects
import Parse from '../services/parseService.js';

const ProfileClassName = 'Profile';

/**
 * createProfile(data)
 * - Create and save a new Profile object in Parse.
 * - Data keys map to Parse fields directly (e.g., firstName, lastName, email).
 * - Caller should validate required fields before calling.
 * @param {Object} data
 * @returns {Promise<Parse.Object>} saved Parse.Object
 */
export const createProfile = async (data = {}) => {
  const obj = new Parse.Object(ProfileClassName);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

/**
 * findProfileById(id)
 * - Fetches a single Profile by Parse objectId.
 * - Throws if id is missing or if the object cannot be fetched.
 * @param {string} id - Parse objectId
 * @returns {Promise<Parse.Object>}
 */
export const findProfileById = async (id) => {
  if (!id) throw new Error('Missing id');
  const Profile = Parse.Object.extend(ProfileClassName);
  const q = new Parse.Query(Profile);
  return q.get(id);
};

/**
 * fetchAllProfiles(limit)
 * - Convenience wrapper to query multiple Profile objects.
 * - Returns an array of Parse.Objects.
 * @param {number} limit
 * @returns {Promise<Parse.Object[]>}
 */
export const fetchAllProfiles = async (limit = 1000) => {
  const Profile = Parse.Object.extend(ProfileClassName);
  const q = new Parse.Query(Profile);
  q.limit(limit);
  return q.find();
};

// individual functions are exported where they're declared above
