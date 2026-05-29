# GodRealm

GodRealm is a faith-native media platform prototype for prayer, testimony, worship videos, podcasts, creator channels, giving, and creator uploads.

## Local Web

```bash
npm install
npm run dev
```

Production builds use:

```text
VITE_API_URL=https://godrealm-api.onrender.com
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
/api/readiness
```

For the deployed Render API:

```bash
npm run test:remote
```

To check another API URL:

```bash
API_URL=https://your-render-service.onrender.com npm run test:remote
```

If `/api/health` reports a MongoDB warning, replace `MONGODB_URI` in Render with the exact MongoDB Atlas driver connection string. A malformed Atlas host should not take the API offline; the service falls back to memory mode and exposes the warning in `/api/readiness`.

## Smoke Test

With the API running on port 3001:

```bash
npm run test:smoke
```

The smoke test registers an admin creator, creates a channel, publishes and moderates media, creates donation and subscription checkouts, schedules a stream, and verifies the giving summary.

## Android APK

The Capacitor Android project is included. To build the debug APK from the current production web build:

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

Windows PowerShell:

```powershell
npm.cmd run build
npx.cmd cap sync android
cd android
.\gradlew.bat assembleDebug
```

Debug APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```
