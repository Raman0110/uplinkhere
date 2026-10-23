# Uplink UI

Next.js frontend for creating secure file requests and receiving uploads.

## Local development

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Then run:

```bash
npm install
npm run dev
```

The API must be running separately. Its development user defaults to Clerk ID `001`; set `DEV_USER_ID` in the API environment when your seeded development user uses another Clerk ID.

## Checks

```bash
npm run build
```
