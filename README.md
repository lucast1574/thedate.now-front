# The Date frontend

Next.js frontend for The Date and Save The Date. A single deployment image serves three Dokploy applications, each with its own host routing:

- `thedate.now`: events landing page
- `*.thedate.now`: published general-event invitations
- `save.thedate.now`: weddings landing page
- `*.save.thedate.now`: published wedding invitations
- `backoffice.thedate.now`: organizer and planner dashboard

Every invitation is a database record. Creating an event does not create a container.

Set `API_INTERNAL_URL` to the Go API's private URL from the Dokploy network. If omitted, the frontend uses `https://api.thedate.now`. Run locally with `npm ci && npm run dev`; build with `npm run build`.

The backend handles payment, guest lists, RSVP capacity, storage and WhatsApp. The frontend stores API sessions in an HTTP-only host cookie.
