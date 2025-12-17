# Vercel Deployment Guide

## Backend Deployment

### 1. Deploy Backend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your backend folder
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** backend
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

### 2. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://blinkfit979:adminwow%40979@librarymanagment.onhbzxm.mongodb.net/
PORT=5000
NODE_ENV=production
```

### 3. Deploy

Click "Deploy" and wait for deployment to complete.

Copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

## Frontend Deployment

### 1. Update Frontend Environment

1. In `frontend/.env`, update:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

### 2. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your frontend folder
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend.vercel.app/api
```

### 4. Deploy

Click "Deploy" and your app will be live!

---

## Important Notes

### Backend Considerations

- Vercel serverless functions have a 10-second timeout on the Hobby plan
- For long-running processes, consider upgrading or using a different platform

### Frontend Build

Make sure `package.json` in frontend has:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### CORS Configuration

Backend is already configured with `cors()` middleware, so cross-origin requests will work.

---

## Alternative Deployment Options

If you encounter issues with Vercel:

### For Backend:
- **Render.com** (Free tier with persistent connections)
- **Railway.app** (Great for Node.js apps)
- **Heroku** (Classic choice)

### For Frontend:
- **Netlify** (Great for React apps)
- **GitHub Pages** (Free static hosting)
- **Cloudflare Pages** (Fast global CDN)

---

## Testing After Deployment

1. Visit your frontend URL
2. Login with admin credentials:
   - Email: `admin@hospital.com`
   - Password: `Hopspital@786`
3. Test all features to ensure API connectivity

---

## Troubleshooting

### Backend Issues

**Problem:** API not responding
- Check Vercel logs in Dashboard
- Verify environment variables are set
- Ensure MongoDB connection string is correct

**Problem:** CORS errors
- Backend already has CORS enabled
- Check if frontend is using correct API URL

### Frontend Issues

**Problem:** Blank screen
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Rebuild and redeploy

**Problem:** API calls failing
- Check Network tab in browser DevTools
- Verify backend is deployed and running
- Check if API URL includes `/api` suffix

---

## Quick Deploy Commands

### Backend
```bash
cd backend
vercel --prod
```

### Frontend
```bash
cd frontend
npm run build
vercel --prod
```

---

Your Hospital Management System is now live! 🚀
