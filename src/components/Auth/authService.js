// Student B - created Auth Module to hold login and signup pages with the auth service

// auth wrapper around Parse.User
import Parse from '../../services/parseService.js';

export const isAuthenticated = () => {
  try {
    return !!Parse.User.current();
  } catch (e) {
    return false;
  }
};

// adding parse auth service  
export const login = async (username, password) => {
  // parse uses username as the login field 
  const user = await Parse.User.logIn(username, password);
  notifyAuthChange();
  return user;
};

export const logout = async () => {
  const res = await Parse.User.logOut();
  notifyAuthChange();
  return res;
};

 //signUp - username (string), password (string), attrs (object) optional additional fields

export const signUp = async (username, password, attrs = {}) => {
  const user = new Parse.User();
  user.set('username', username);
  user.set('password', password);
  // copy other attrs (email, firstName etc.)
  Object.keys(attrs).forEach((k) => user.set(k, attrs[k]));
  const res = await user.signUp();
  notifyAuthChange();
  return res;
};

// simple pub/sub so UI can react to auth changes
const listeners = new Set();
export const subscribe = (cb) => {
  if (typeof cb !== 'function') return () => {};
  listeners.add(cb);
  // call immediately with current user
  try {
    cb(Parse.User.current());
  } catch (e) {
    // ignore
  }
  return () => listeners.delete(cb);
};

const notifyAuthChange = () => {
  const cur = Parse.User.current();
  listeners.forEach((cb) => {
    try {
      cb(cur);
    } catch (e) {
      // swallow listener errors
      // console.error('auth subscriber error', e);
    }
  });
};

const authService = { isAuthenticated, login, logout, signUp };
export default authService;
