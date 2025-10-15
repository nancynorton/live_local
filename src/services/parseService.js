// initalize parse for back4app
import Parse from 'parse';

// Back4App credentials
const APP_ID = 'OzeGZnVRk2XBdXanHmKdT5ZGrQVcBBDFbcp1b5es';
const JS_KEY = 'WmAlAUboHcTJo3pNg72zZ5I3dQvofRQNRGvR2BDK';

// Initialize Parse 
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;
