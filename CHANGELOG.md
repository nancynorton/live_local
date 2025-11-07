# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-10-15
- Move Parse queries into model files (Business, Profile, Review).
- Centralize CRUD and query helpers in `src/models/*`.
- Use named exports for models to satisfy lint rules.
- Wire Application/Profile forms to save to Parse via model helpers.
- Added comments for all Parse queries and Routing. 
- Intialized routing and created routes between modules. 
- Configured webpack with current implementation. 
- Changed to version to 0.2.0.


## [0.3.0] - 2025-11-6
- Created Auth module in  `src/components/Auth/`, with `Login`, `Register`, and `RedirectIfAuthenticated` .js files 
- Added Parse authentication service `src/components/Auth/authService.js` with login, register, logout features
- Implemented `ProtectedRoute` component in `src/components/ProtectedRoute.js`to render children when user is authenticated
- Updated routes/route definitions in `src/App.js` 
- Updated Profile page to include edit / delete functionality 
- Added sample reviews / data 
