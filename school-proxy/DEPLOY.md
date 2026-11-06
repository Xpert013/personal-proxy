# Deploy to Render

This is Mercury Workshop's Scramjet-App, upstream revision
f6f83cbc93091e47b9c357eb00ea289828aedf94, with a corrected Dockerfile
and Render Blueprint. Original attribution and license are retained.

1. Create an empty GitHub repository.
2. Extract the supplied ZIP. Upload the contents of its school-proxy folder
   to the repository root. Dockerfile, package.json and render.yaml must be
   at the top level, not inside another school-proxy directory.
3. In Render choose New > Blueprint, connect GitHub, select this repository,
   and review/apply the Blueprint. Alternatively select New > Web Service,
   choose the repository, Docker runtime and Free instance type.
4. Wait for deployment to finish and open the onrender.com address.
5. Enter an HTTPS website address in the search field and press Enter.

No custom build or start command is needed: Dockerfile supplies both.
The service listens on Render's PORT and includes its own Wisp transport.
This deployment is publicly accessible, with no login gate. Do not enter
sensitive credentials into proxied sites. Browser compatibility, destination
site availability and access through a school filter are not guaranteed.

Verification: server JavaScript syntax checked locally. Docker build,
Render deployment and end-to-end browsing still require verification.
