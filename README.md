# The Date frontend

Next.js frontend for The Date and Save The Date. A single deployment image serves three Dokploy applications, each with its own host routing:

- `thedate.now`: events landing page
- `*.thedate.now`: published general-event invitations
- `save.thedate.now`: weddings landing page
- `*.save.thedate.now`: published wedding invitations
- `studio.save.thedate.now`: wedding studio
- `crea.thedate.now`: general event studio
- `backoffice.thedate.now`: redirects to the general event studio

Every invitation is a database record. Creating an event does not create a container.

Set `API_INTERNAL_URL` to the Go API's private URL from the Dokploy network. If omitted, the frontend uses `https://api.thedate.now`. Run locally with `npm ci && npm run dev`; build with `npm run build`.

The backend handles payment, guest lists, RSVP capacity, storage and WhatsApp. The frontend stores API sessions in an HTTP-only host cookie.

Google login is optional. Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the shared studio application, plus `GOOGLE_CLIENT_ID` in the API. Google Cloud must authorize `https://studio.save.thedate.now/api/auth/google/callback` and `https://crea.thedate.now/api/auth/google/callback`. Until the credentials are set, the Google button stays hidden. Set `PAYMENTS_ENABLED=true` only after the backend has Stripe test credentials and the test webhook is working; until then, the price is shown with checkout disabled.
