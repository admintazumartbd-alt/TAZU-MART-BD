# Deployment Guide for Netlify

To ensure your Tazu Mart BD website works correctly on Netlify, follow these steps:

## 1. Backend Hosting
Netlify is for static hosting and cannot run the Express backend (`server.ts`). You must host the backend on a service like **Cloud Run** (which is already configured in this environment) or **Heroku**.

## 2. Netlify Environment Variables
In your Netlify site settings, add the following environment variables:
- `VITE_API_BASE_URL`: The URL of your live backend (e.g., `https://your-backend-url.run.app`). **Do not include a trailing slash.**
- `VITE_FIREBASE_API_KEY`: (If you use client-side Firebase directly)
- `VITE_FIREBASE_AUTH_DOMAIN`: (If you use client-side Firebase directly)

## 3. Backend Environment Variables
In your backend hosting service (Cloud Run, etc.), add:
- `ALLOWED_ORIGINS`: Your Netlify site URL (e.g., `https://your-site.netlify.app`). This allows the backend to accept requests from your frontend.

## 4. Google / Firebase Auth Configuration
If Google Login is not working:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Go to **Authentication** > **Settings** > **Authorized domains**.
4. Add your Netlify domain (e.g., `your-site.netlify.app`) to the list.

## 5. Netlify Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## 6. SPA Routing (Redirects)
Since this is a Single Page Application (SPA), you need to handle routing redirects on Netlify. Create a file named `_redirects` in your `public` folder (or `dist` after build) with the following content:
```
/*    /index.html   200
```
This ensures that all routes are handled by your React app.
