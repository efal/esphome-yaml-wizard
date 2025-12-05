# Deployment Checklist for Netlify

## Pre-Deployment Steps

### 1. Environment Variables
- [ ] Get a Gemini API key from https://aistudio.google.com/
- [ ] Add `GEMINI_API_KEY` to Netlify environment variables

### 2. Icons (Optional Optimization)
The current icons use the same 512x512 image for all sizes. For better performance:
- [ ] Use an image editing tool to properly resize icons to each size
- [ ] Optimize PNG files using tools like TinyPNG or Squoosh

### 3. Test Locally
```bash
npm run build
npm run preview
```
- [ ] Test all manual component features
- [ ] Test AI generation (if API key is set)
- [ ] Test offline functionality
- [ ] Test PWA installation

## Netlify Deployment

### Option A: Git-based Deployment (Recommended)

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: ESPHome YAML Wizard PWA"
```

2. Push to GitHub/GitLab:
```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

3. Connect to Netlify:
   - Login to Netlify
   - Click "New site from Git"
   - Select your repository
   - Build settings are auto-detected from `netlify.toml`
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy!

### Option B: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Drag the `dist` folder to Netlify's deploy page

3. Add environment variables in site settings

## Post-Deployment Verification

- [ ] Visit the deployed URL
- [ ] Test PWA installation (Add to Home Screen)
- [ ] Test offline mode (disconnect internet, reload)
- [ ] Verify all components work
- [ ] Test AI generation
- [ ] Check icon appears correctly on mobile home screen
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)

## Custom Domain (Optional)

1. Go to Netlify site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to provision

## Performance Optimization Tips

1. **CDN Resources**: Consider self-hosting Tailwind CSS for better offline support
2. **Code Splitting**: Already handled by Vite
3. **Image Optimization**: Optimize all PNG icons
4. **Analytics**: Add Netlify Analytics for usage insights

## Troubleshooting

### Service Worker not registering
- Check browser console for errors
- Ensure HTTPS (Netlify provides this automatically)
- Clear cache and reload

### AI features not working
- Verify `GEMINI_API_KEY` is set in Netlify environment variables
- Check it's using the production environment variable name
- Redeploy after adding environment variables

### Icons not showing
- Check that all icon files exist in `dist/icons/`
- Verify paths in manifest.json
- Test on different devices

### Build fails
- Check Node version (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Review build logs in Netlify

## Maintenance

### Updating the app
1. Make changes locally
2. Test with `npm run dev`
3. Build with `npm run build`
4. Commit and push (auto-deploys on Netlify)

### Updating dependencies
```bash
npm update
npm audit fix
```

## Support

For issues, check:
- ESPHome documentation: https://esphome.io
- Netlify documentation: https://docs.netlify.com
- Vite documentation: https://vitejs.dev
