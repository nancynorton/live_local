// Business model helpers — all Parse queries for `Business` centralized here.

import Parse from '../services/parseService.js';

const BusinessClassName = 'Business';

/**
 * Helper: normalize a Parse.Object into a plain JS object.
 * - Prefers Parse.Object#get(...) when available to preserve dynamic fields.
 * - Falls back to toJSON() when appropriate so objectId and meta are present.
 * @param {Parse.Object|Object|null} obj
 * @returns {Object|null} plain object with common fields (Name, Category, Keywords, Address(s))
 */
const toPlain = (obj) => {
  if (!obj) return null;
  const json = obj.toJSON ? obj.toJSON() : obj;
  return {
    ...json,
    Name: obj.get ? obj.get('Name') : json.Name,
    Category: obj.get ? obj.get('Category') : json.Category,
    Keywords: obj.get ? obj.get('Keywords') : json.Keywords,
    Address: obj.get ? obj.get('Address') : json.Address,
    Addresses: obj.get ? obj.get('Addresses') : json.Addresses,
  };
};

/**
 * fetchAll(limit = 1000)
 * - Returns an array of Parse.Objects for the Business class.
 * - thin wrapper around Parse.Query with a configurable limit.
 * - Throws on network/auth errors
 * @param {number} limit
 * @returns {Promise<Parse.Object[]>}
 */
export const fetchAll = async (limit = 1000) => {
  const Business = Parse.Object.extend(BusinessClassName);
  const q = new Parse.Query(Business);
  q.limit(limit);
  return q.find();
};

/**
 * findByKeyword(keyword, limit)
 * - Searches multiple fields (Keywords contains, Name regex, Category regex)
 * - Uses Parse.Query.or to combine sub-queries so results match any
 * - Case-insensitive for Name and Category via `matches(..., 'i')`.
 *   If Keywords is an array field, contains will match if the array item contains the substring.
 * @param {string} keyword
 * @param {number} limit
 * @returns {Promise<Parse.Object[]>}
 */
export const findByKeyword = async (keyword, limit = 1000) => {
  if (!keyword) return fetchAll(limit);

  const Business = Parse.Object.extend(BusinessClassName);

  // 1) Keyword contains (substring)
  const qKeywordsContains = new Parse.Query(Business);
  qKeywordsContains.contains('Keywords', keyword);

  // 2) Name matches (case-insensitive regex)
  const qName = new Parse.Query(Business);
  qName.matches('Name', keyword, 'i');

  // 3) Category matches (case-insensitive regex)
  const qCategory = new Parse.Query(Business);
  qCategory.matches('Category', keyword, 'i');

  const main = Parse.Query.or(qKeywordsContains, qName, qCategory);
  main.limit(limit);
  return main.find();
};

/**
 * findByCategory(category, limit)
 * - Exact category match but case-insensitive. Uses a regex anchored (^...$).
 * - Escapes special regex characters in the incoming category string.
 * - Returns Parse.Object[]; caller may convert to plain objects.
 * @param {string} category
 * @param {number} limit
 * @returns {Promise<Parse.Object[]>}
 */
export const findByCategory = async (category, limit = 1000) => {
  if (!category) return fetchAll(limit);
  const Business = Parse.Object.extend(BusinessClassName);
  const q = new Parse.Query(Business);
  // escape regex special chars in category to avoid accidental patterns
  const escaped = category.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  q.matches('Category', `^${escaped}$`, 'i');
  q.limit(limit);
  return q.find();
};

/**
 * findById(id)
 * - Returns a single Parse.Object by objectId.
 * - Throws if id missing or if Parse returns an error (e.g., not found, permission).
 */
export const findById = async (id) => {
  if (!id) throw new Error('Missing id');
  const Business = Parse.Object.extend(BusinessClassName);
  const q = new Parse.Query(Business);
  return q.get(id);
};

/**
 * createBusiness(data)
 * - Creates and saves a new Business Parse.Object.
 * - `data` is arbitrary; keys map directly to fields stored in Parse.
 */
export const createBusiness = async (data = {}) => {
  const obj = new Parse.Object(BusinessClassName);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

/**
 * updateBusiness(id, data)
 * - Loads existing object by id, sets fields, and saves.
 * - Throws on missing id or if fetch/save fails.
 */
export const updateBusiness = async (id, data = {}) => {
  if (!id) throw new Error('Missing id');
  const Business = Parse.Object.extend(BusinessClassName);
  const q = new Parse.Query(Business);
  const obj = await q.get(id);
  Object.keys(data).forEach((k) => obj.set(k, data[k]));
  return obj.save();
};

/**
 * deleteBusiness(id)
 * - Deletes an object by id (fetch + destroy). Caller must handle permission errors.
 */
export const deleteBusiness = async (id) => {
  if (!id) throw new Error('Missing id');
  const Business = Parse.Object.extend(BusinessClassName);
  const q = new Parse.Query(Business);
  const obj = await q.get(id);
  return obj.destroy();
};

// export converter for convenience
export const toPlainObject = (obj) => toPlain(obj);