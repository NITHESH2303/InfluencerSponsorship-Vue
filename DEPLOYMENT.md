# Deployment Instructions for Vercel

## Prerequisites
- Backend API is hosted at: `https://influencer-sponsorship-api.onrender.com`
- Vercel account is required

## Environment Variables Setup

### For Local Development
- Update the `.env` file to use `http://127.0.0.1:5000` for local development

### For Production (Vercel)
Either:
1. **Option A**: Keep the production URL in `.env` file (current setup)
2. **Option B**: Set environment variable in Vercel dashboard:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://influencer-sponsorship-api.onrender.com`

(Option B is recommended as it keeps local and production configs separate)

## Deployment Steps

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to deploy

### Option 2: Deploy via Git Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variable in Vercel dashboard
4. Deploy

### Option 3: Deploy via Vercel Dashboard
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Set the environment variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://influencer-sponsorship-api.onrender.com`
5. Deploy

## Build Configuration
The project is configured with:
- Build command: `vite build`
- Output directory: `dist`
- Framework preset: Vite

## Files Added/Modified for Deployment

- `.env` - Environment configuration (API URL)
- `vercel.json` - Vercel deployment configuration  
- `src/api.js` - Updated to use environment variables
- All Vue files - Updated to use centralized API base URL

## CORS Configuration
Make sure your backend allows CORS requests from your Vercel domain. You may need to update your backend CORS settings to include your Vercel deployment URL.

## Testing
After deployment, test the following:
1. User registration/login
2. API calls work correctly
3. Authentication flows
4. All major features

## Troubleshooting
- If API calls fail, check the CORS settings on your backend
- Verify the environment variable is set correctly in Vercel
- Check the browser console for any CORS or network errors