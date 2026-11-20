# Chaithrika & Nihan — family portfolio

Next.js 16 site with a built-in CMS:

- **MongoDB** stores page content (all text and which photo goes where), the photo library and booking enquiries.
- **ImageKit** stores the photos. Uploads go straight from the browser to ImageKit, signed by the server.
- **/admin** is the editing panel, protected by a password.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in:
   - `ADMIN_PASSWORD`: what you type on `/admin/login`.
   - `ADMIN_SECRET`: a long random string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `MONGODB_URI` (and optionally `MONGODB_DB`): from MongoDB Atlas → Connect → Drivers. In Atlas → Network Access, allow your server's IP (or `0.0.0.0/0` for Vercel).
   - `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`: from ImageKit → Developer options.
3. `npm run dev` and open <http://localhost:3000/admin>.

When deploying (e.g. Vercel), add the same variables in the project's environment settings.

## Using the CMS

| Admin page | What it does |
| --- | --- |
| Dashboard | Page overview, photo and enquiry counts, and a one-click **Move photos to ImageKit** for the built-in photos in `public/images`. |
| Home page / Chaithrika / Nihan | Edit every section: headings, text, lists, gallery items (add, remove, reorder) and photos. **Save & publish** (or Ctrl+S) updates the live site immediately. |
| Photos | Upload, search, copy links and delete photos in ImageKit. Photos still used on a page can't be deleted. |
| Enquiries | Messages from the booking forms on `/chaithrika` and `/nihan`. Mark read or delete. |

Text fields marked "rich" accept `*accent*` (the italic/coloured style of each design) and `**bold**`.

Until something is saved, every page uses its built-in content (`src/lib/cms/pages/*.ts`), so the site works even
without a database.

## Code map

- `src/lib/cms/pages/*.ts`: each page's content type, built-in defaults and the admin form schema.
- `src/lib/cms/fields.ts`: the schema types and the sanitiser that every save passes through.
- `src/lib/cms/content.ts`: cached content loading for the public pages.
- `src/lib/db.ts`, `src/lib/imagekit.ts`, `src/lib/auth.ts`: MongoDB, ImageKit REST API and signed session cookies.
- `src/proxy.ts`: redirects signed-out visitors of `/admin` to the login page.
- `src/app/admin/`: the admin UI and its Server Actions (`actions.ts`).
- `src/app/actions/enquiry.ts`: saves booking-form enquiries.

To make a new field editable: add it to the page's type and defaults, add a field to its schema, and render it in
the page component.
