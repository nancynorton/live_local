// Review model helpers for Parse 'Review' class
import Parse from '../services/parseService.js';

const ReviewClassName = 'Review';

/** Create and save a Review object
 * @param {Object} data - fields for the review (e.g., businessId, rating, text)
 * @returns {Promise<Parse.Object>}
 */
export const createReview = async (data = {}) => {
  const obj = new Parse.Object(ReviewClassName); //create new instance of review class
  // Ensure rating is stored as a Number (Parse schema expects Number)
  const sanitized = { ...data };
  if (sanitized.rating !== undefined) {
    const n = Number(sanitized.rating);
    sanitized.rating = Number.isNaN(n) ? null : n;
  }
  Object.keys(sanitized).forEach((k) => obj.set(k, sanitized[k])); //assign each prop from data to parse obj
  // attach author info when available
  try {
    const current = Parse.User.current();
    if (current) {
      // store a readable author name and also a pointer to the user
      const username = current.get ? (current.get('username') || current.get('email')) : current.username || current.email;
      if (username) obj.set('authorName', username);
      obj.set('author', current);
    }
  } catch (e) {
    // ignore if Parse.User.current() isn't available
  }
  return obj.save();
};

export const findReviewsByBusiness = async (businessObjectId, limit = 1000) => {
  if (!businessObjectId) return []; //empty arr if no business id provided
  const Review = Parse.Object.extend(ReviewClassName); 
  const q = new Parse.Query(Review); // filter reviews where businessid matches the provided id
  q.equalTo('businessId', businessObjectId); 
  q.limit(limit);//lim number of returned results
  return q.find(); //execute query
};

export const fetchAllReviews = async (limit = 1000) => {
  const Review = Parse.Object.extend(ReviewClassName); //create new query on review class
  const q = new Parse.Query(Review);
  q.limit(limit);
  return q.find(); //return all reviews up to limit
};

const ReviewAPI = {
  createReview,
  findReviewsByBusiness,
  fetchAllReviews,
};

export default ReviewAPI;
