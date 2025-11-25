Netlify Deployment Steps

1. Push your repo to GitHub (or GitLab/Bitbucket).

2. In Netlify:
   - Click "New site" -> "Import from Git" -> choose your repo.
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. Add environment variables (Site settings -> Build & deploy -> Environment):
   - REACT_APP_PARSE_APP_ID = <your Back4App Application ID>
   - REACT_APP_PARSE_JS_KEY = <your Back4App JavaScript Key>
   - REACT_APP_PARSE_SERVER_URL = https://parseapi.back4app.com/

4. Deploy. Netlify will build and publish the site. For SPA routing, a `netlify.toml` with a redirect to `/index.html` is included in the repo.

5. Post-deploy checks:
   - Open the deployed site and submit the Application form including an image.
   - Verify the new business appears and its image loads.
   - If the image fails, inspect Console/Network and check for 403 responses (ACL issue). This repo sets public read ACL on created businesses by default.

Optional:
- Use Netlify "Domain settings" to configure a custom domain and enable HTTPS (automatic).
- Set branch under Site settings to control which branch triggers deploys.
