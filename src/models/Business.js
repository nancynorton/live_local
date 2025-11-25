// Business model helpers — all Parse queries for `Business` centralized here.

import Parse from '../services/parseService.js';

const BusinessClassName = 'Business';

/**
 * Helper: normalize a Parse.Object into a plain JS object.
 * - Prefers Parse.Object#get(...) when available to preserve dynamic fields.
 * - Falls back to to json() when appropriate so objectId and meta are present.
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
 * - throws on network/auth errors
 */

export const fetchAll = async (limit = 1000) => {
  const Business = Parse.Object.extend(BusinessClassName);
  const q = new Parse.Query(Business);
  q.limit(limit);
  return q.find();
};

/**
 * findByKeyword(keyword, limit)
 * - searches multiple fields (Keywords contains, Name regex, Category regex)
 * - Uses Parse.Query.or to combine sub-queries so results match any
 * - case insensitive for Name and Category via `matches(..., 'i')`
 *   if keywrds is an array field, contains will match if the array item contains the substring.
 */
export const findByKeyword = async (keyword, limit = 1000) => {
  if (!keyword) return fetchAll(limit);

  const Business = Parse.Object.extend(BusinessClassName);

  // Prepare variations of the keyword (singular/plural)
  const keywordLower = keyword.toLowerCase();
  const keywordSingular = keywordLower.endsWith('s') ? keywordLower.slice(0, -1) : keywordLower;
  const keywordPlural = keywordLower.endsWith('s') ? keywordLower : keywordLower + 's';

  // 1) Keywords contains (case-insensitive for any variation)
  const qKeywordsSingular = new Parse.Query(Business);
  qKeywordsSingular.matches('Keywords', keywordSingular, 'i');
  
  const qKeywordsPlural = new Parse.Query(Business);
  qKeywordsPlural.matches('Keywords', keywordPlural, 'i');

  // 2) Name matches (case-insensitive regex)
  const qName = new Parse.Query(Business);
  qName.matches('Name', keyword, 'i');

  // 3) Category matches (case-insensitive regex)
  const qCategory = new Parse.Query(Business);
  qCategory.matches('Category', keyword, 'i');

  const main = Parse.Query.or(qKeywordsSingular, qKeywordsPlural, qName, qCategory);
  main.limit(limit);
  console.log('Parse query conditions:', {
    keywordSingular,
    keywordPlural,
    keyword
  });
  return main.find();
};

/**
 * findByCategory(category, limit)
 * - Exact category match but case-insensitive. Uses a regex anchored (^...$).
 * - Escapes special regex characters in the incoming category string.
 * - Returns Parse.Object[]; caller may convert to plain objects.
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
  // Convert any browser File/Blob to Parse.File before setting
  // If a file is present, save the Parse.File first so the binary uploads reliably.
  for (const k of Object.keys(data)) {
    const val = data[k];
    try {
      if (typeof window !== 'undefined' && (val instanceof File || val instanceof Blob)) {
        const fileName = val.name || `${k}.jpg`;
        const pfile = new Parse.File(fileName, val);
        try {
          // save Parse.File first to ensure upload; this can fail if network or ACLs block it
          await pfile.save();
          obj.set(k, pfile);
        } catch (pfErr) {
          console.error('Parse.File save failed for', k, pfErr);
          // fallback: still attach the Parse.File object (Parse may attempt upload on obj.save())
          obj.set(k, pfile);
        }
      } else {
        obj.set(k, val);
      }
    } catch (e) {
      console.error('createBusiness: error processing field', k, e);
      obj.set(k, val);
    }
  }
  // Ensure the saved business is publicly readable so uploaded images are accessible by the site
  try {
    // set a public-read ACL on the business object
    try {
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false);
      obj.setACL(acl);
    } catch (aclErr) {
      // If ACL API isn't available for some reason, continue without failing
      console.warn('Could not set ACL on Business object', aclErr);
    }

    const saved = await obj.save();
    return saved;
  } catch (saveErr) {
    console.error('createBusiness: obj.save() failed', saveErr);
    throw saveErr;
  }
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
  // Convert File/Blob values to Parse.File before setting
  Object.keys(data).forEach((k) => {
    const val = data[k];
    try {
      if (typeof window !== 'undefined' && (val instanceof File || val instanceof Blob)) {
        const fileName = val.name || `${k}.jpg`;
        const pfile = new Parse.File(fileName, val);
        obj.set(k, pfile);
      } else {
        obj.set(k, val);
      }
    } catch (e) {
      obj.set(k, val);
    }
  });
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