# GodRealm

GodRealm is a faith-native media platform prototype for prayer, testimony, worship videos, podcasts, creator channels, giving, and creator uploads.

## Local Web

```bash
npm install
npm run dev
```

## Local API

```bash
npm run api
```

## Render

This repo includes `render.yaml` with:

- `godrealm-api`
- `godrealm-web`

Set the secret environment variables in Render:

- `MONGODB_URI`
- `ALLOWED_ORIGINS`
- `VITE_API_URL`
- optional Cloudinary, Paystack, Hubtel, and Stripe keys

## API Health

```text
/api/health
```

## Smoke Test

With the API running on port 3001:

```bash
npm run test:smoke
```

The smoke test registers an admin creator, creates a channel, publishes and moderates media, creates donation and subscription checkouts, schedules a stream, and verifies the giving summary.
