// Review model helpers for Parse 'Review' class
import Parse from '../services/parseService.js';

const ReviewClassName = 'Review';

/** Create and save a Review object
 * @param {Object} data - fields for the review (e.g., businessId, rating, text)
 * @returns {Promise<Parse.Object>}
 */
export const createReview = async (data = {}) => {
  const obj = new Parse.Object(ReviewClassName); //create new instance of review class
  Object.keys(data).forEach((k) => obj.set(k, data[k])); //assign each prop from data to parse obj
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

export default { //export helper functions together as default object
  createReview,
  findReviewsByBusiness,
  fetchAllReviews,
};
