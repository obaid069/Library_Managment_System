# Hospital Management System - Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- MongoDB Atlas account with active cluster
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Code for Deployment

#### Backend Preparation
The backend is already configured with:
- ✅ `vercel.json` for serverless deployment
- ✅ `.gitignore` file
- ✅ Environment variables structure

#### Frontend Preparation
The frontend is already configured with:
- ✅ `vercel.json` for SPA routing
- ✅ Build scripts in package.json
- ✅ Environment variable template

### 2. Deploy Backend to Vercel

1. **Push your code to Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-git-repo-url>
   git push -u origin main
   ```

2. **Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login
   - Click "Add New Project"

3. **Import Backend**:
   - Select your Git repository
   - Select the `backend` folder as the root directory
   - Framework Preset: **Other**
   - Build Command: Leave empty
   - Output Directory: Leave empty
   
4. **Configure Environment Variables**:
   Add these environment variables in Vercel project settings:
   ```
   MONGODB_URI=mongodb+srv://blinkfit979:adminwow%40979@librarymanagment.onhbzxm.mongodb.net/
   PORT=5000
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### 3. Deploy Frontend to Vercel

1. **Create Production Environment File**:
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
   Replace `https://your-backend.vercel.app` with your actual backend URL from step 2.

2. **Import Frontend**:
   - In Vercel dashboard, click "Add New Project"
   - Select your Git repository again
   - Select the `frontend` folder as the root directory
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables**:
   Add environment variable in Vercel project settings:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-frontend.vercel.app`

### 4. MongoDB Atlas Configuration

Make sure your MongoDB Atlas cluster allows connections from anywhere:

1. Go to MongoDB Atlas Dashboard
2. Navigate to Network Access
3. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
4. This is necessary because Vercel uses dynamic IPs

### 5. Test Your Deployment

1. **Test Backend**:
   - Visit `https://your-backend.vercel.app/api/doctors`
   - Should return JSON response

2. **Test Frontend**:
   - Visit `https://your-frontend.vercel.app`
   - Login with admin credentials:
     - Email: `admin@hospital.com`
     - Password: `Hopspital@786`

3. **Test Integration**:
   - Navigate through dashboards
   - Try adding a patient or doctor
   - Book an appointment

### 6. Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://blinkfit979:adminwow%40979@librarymanagment.onhbzxm.mongodb.net/
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## Troubleshooting

### Backend Issues
- **Error: Cannot connect to MongoDB**
  - Verify MongoDB Atlas network access allows 0.0.0.0/0
  - Check MONGODB_URI is correctly set in Vercel environment variables

- **Error: 404 on API routes**
  - Ensure vercel.json is in backend root
  - Check that routes are properly exported in server.js

### Frontend Issues
- **Error: API calls failing**
  - Verify VITE_API_URL points to correct backend URL
  - Check browser console for CORS errors
  - Ensure backend CORS is configured to allow your frontend domain

- **Error: 404 on page refresh**
  - Verify vercel.json has rewrite rules for SPA routing

### General Issues
- **Environment variables not working**
  - Rebuild and redeploy after adding/changing environment variables
  - Ensure variable names match exactly (case-sensitive)

## Continuous Deployment

Vercel automatically redeploys when you push to your Git repository:
- Push to main branch = Production deployment
- Push to other branches = Preview deployments

## Performance Optimization

1. **Enable Caching** (already configured):
   - Vercel automatically caches static assets
   - API responses can be cached with headers

2. **Monitor Performance**:
   - Use Vercel Analytics (available in dashboard)
   - Check MongoDB Atlas performance metrics

## Security Best Practices

1. **Never commit .env files** to Git (already in .gitignore)
2. **Use environment variables** for all sensitive data
3. **Keep MongoDB Atlas IP whitelist** updated if not using 0.0.0.0/0
4. **Regularly update dependencies** for security patches

## Support

If you encounter issues:
- Check Vercel deployment logs in dashboard
- Review function logs for serverless backend
- Verify environment variables are set correctly
- Test API endpoints directly before testing frontend

---

**Deployment completed successfully!** 🎉

Your Hospital Management System is now live and accessible worldwide.
