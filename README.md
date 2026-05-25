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
