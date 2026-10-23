# Uplink UI

Next.js frontend for creating secure file requests and receiving uploads.

## Local development

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Then run:

```bash
npm install
npm run dev
```

The API must be running separately with the matching `CLERK_SECRET_KEY`. Private API requests use the signed-in user's Clerk session token; there is no shared development-user bypass.

## Checks

```bash
npm run build
```
