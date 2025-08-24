# LifeMoments Deployment Guide

This guide covers deploying your LifeMoments app to production using either Netlify or Vercel.

## Prerequisites

- Your Supabase project is set up and configured
- You have your environment variables ready
- Your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Option 1: Deploy to Vercel (Recommended)

Vercel provides excellent Next.js support out of the box.

### Steps:

1. **Connect your repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

2. **Configure environment variables**
   Add these environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ldrvjgcubgwzgowimvdg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Deploy**
   - Vercel will automatically detect this is a Next.js project
   - Click "Deploy"
   - Your app will be live in ~2 minutes

### Custom Domain (Optional)
- In Vercel dashboard, go to Settings > Domains
- Add your custom domain (e.g., lifemoments.yourdomain.com)

## Option 2: Deploy to Netlify

### Steps:

1. **Connect your repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install the Next.js plugin

3. **Set environment variables**
   In Netlify dashboard under Site settings > Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ldrvjgcubgwzgowimvdg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Deploy**
   - Click "Deploy site"
   - Your app will be live once build completes

## Post-Deployment Checklist

### 1. Update Supabase Settings
In your Supabase dashboard:
- Go to Authentication > Settings
- Add your production domain to "Site URL"
- Add your domain to "Redirect URLs"

### 2. Test Core Features
- [ ] User registration and login
- [ ] Audio recording and saving
- [ ] Memory timeline viewing
- [ ] Audio playback

### 3. Configure OAuth (Optional)
If using Google OAuth:
- Update your Google OAuth app settings
- Add your production domain to authorized origins

### 4. Set up Monitoring
Consider adding:
- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript types are correct
- Verify environment variables are set

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check that your domain is added to Supabase allowed origins
- Ensure redirect URLs are properly configured

### Audio Upload Issues
- Verify Supabase storage bucket exists and has proper policies
- Check file size limits
- Ensure CORS is configured for your domain

## Custom Domain Setup

### Vercel
1. In Vercel dashboard: Settings > Domains
2. Add your domain
3. Configure DNS with your provider

### Netlify
1. In Netlify dashboard: Site settings > Domain management
2. Add custom domain
3. Configure DNS records

## Security Considerations

- The app includes security headers by default
- Supabase handles authentication securely
- All sensitive data is stored server-side
- File uploads are validated and scoped to user accounts

## Performance Optimization

- Images are automatically optimized by Next.js
- Static pages are pre-rendered
- API routes are serverless functions
- Audio files are streamed efficiently

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test locally with production environment variables
4. Check Supabase project status and logs
