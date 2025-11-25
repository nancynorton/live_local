// initalize parse for back4app
import Parse from 'parse';

// Back4App credentials
const APP_ID = process.env.REACT_APP_PARSE_APP_ID;
const JS_KEY = process.env.REACT_APP_PARSE_JS_KEY;
const PARSE_URL = process.env.REACT_APP_PARSE_SERVER_URL || 'https://parseapi.back4app.com/';
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = PARSE_URL;
// Warn in dev if env vars are not set (helps debugging deployments)
if (!APP_ID || !JS_KEY) {
	// eslint-disable-next-line no-console
	console.warn('Parse credentials are not set. Make sure REACT_APP_PARSE_APP_ID and REACT_APP_PARSE_JS_KEY are provided.');
}

export default Parse;
