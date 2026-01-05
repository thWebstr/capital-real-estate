# 🚀 Capital Real Estate - Deployment Guide

Complete guide to deploying your application to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features are working locally
- [ ] No console errors or warnings
- [ ] Environment variables are properly configured
- [ ] Build runs successfully (`npm run build`)
- [ ] Images and assets are optimized
- [ ] API keys are secured (use backend proxy)
- [ ] README.md is up to date
- [ ] Git repository is clean

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Best for:** React apps, automatic deployments, free SSL

#### Steps (Vercel)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/thWebstr/Capital-Real-Estate.git
git push -u origin main
```

1. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Scope? Your account
# - Link to existing project? No
# - Project name? capital-real-estate
# - Directory? ./
# - Override settings? No
```

1. **Set Environment Variables**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Select your project
- Settings → Environment Variables
- Add each variable:
  - `VITE_GOOGLE_MAPS_API_KEY`
  - `VITE_ANTHROPIC_API_KEY`
  - `VITE_API_BASE_URL`

1. **Redeploy**

```bash
vercel --prod
```

**Custom Domain:**

- Settings → Domains
- Add your domain
- Update DNS records as instructed

---

### Option 2: Netlify

**Best for:** Static sites, drag-and-drop deployment

#### Steps (Netlify)

1. **Build Project**

```bash
npm run build
```

1. **Deploy via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Choose:
# - Create & configure new site
# - Team: Your account
# - Site name: capital-real-estate
# - Publish directory: dist

# Production deployment:
netlify deploy --prod
```

1. **Or Deploy via Drag & Drop**

- Go to [Netlify](https://app.netlify.com/)
- Drag `dist` folder to deployment zone

1. **Set Environment Variables**

- Site Settings → Environment Variables
- Add all variables from `.env`

1. **Configure Build Settings**

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

**Custom Domain:**

- Domain Settings → Add custom domain
- Update DNS records

---

### Option 3: GitHub Pages

**Best for:** Simple static hosting, free for public repos

#### Steps (GitHub Pages)

1. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

1. **Update package.json**

```json
{
  "homepage": "https://thWebstr.github.io/Capital-Real-Estate",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

1. **Update vite.config.js**

```javascript
export default defineConfig({
  base: '/Capital-Real-Estate/',
  // ... rest of config
})
```

1. **Deploy**

```bash
npm run deploy
```

1. **Enable GitHub Pages**

- Go to repository Settings
- Pages → Source: gh-pages branch
- Save

**Note:** GitHub Pages doesn't support environment variables. You'll need a backend proxy for API keys.

---

### Option 4: AWS S3 + CloudFront

**Best for:** Full control, scalability, enterprise

#### Steps (AWS S3 + CloudFront)

1. **Build Project**

```bash
npm run build
```

1. **Create S3 Bucket**

- Go to AWS S3 Console
- Create bucket: `capital-real-estate`
- Enable static website hosting
- Upload `dist` folder contents

1. **Set Bucket Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::capital-real-estate/*"
    }
  ]
}
```

1. **Create CloudFront Distribution**

- Origin: S3 bucket
- Redirect HTTP to HTTPS
- Enable compression

1. **Deploy via AWS CLI**

```bash
aws s3 sync dist/ s3://capital-real-estate --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🔒 Security for Production

### 1. API Key Protection

**❌ Never do this:**

```javascript
// Exposed API key in frontend
const API_KEY = "sk-ant-api03-xxxxx";
```

**✅ Do this instead:**

Create a backend proxy:

```javascript
// backend/server.js (Node.js + Express)
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Proxy endpoint for Anthropic API
app.post('/api/ai-chat', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Proxy endpoint for Google Maps
app.get('/api/maps', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_MAPS_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
```

**Update frontend to use proxy:**

```javascript
// Instead of direct API call
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': API_KEY }
});

// Use your backend proxy
const response = await fetch('https://your-backend.com/api/ai-chat', {
  method: 'POST',
  body: JSON.stringify(requestData)
});
```

### 2. Deploy Backend

**Vercel Serverless:**

```javascript
// api/ai-chat.js
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.json(data);
}
```

**Netlify Functions:**

```javascript
// netlify/functions/ai-chat.js
exports.handler = async (event) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: event.body
  });
  
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
```

---

## ⚡ Performance Optimization

### 1. Image Optimization

```bash
# Install image optimizer
npm install --save-dev vite-plugin-imagemin

# Add to vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: { plugins: [{ name: 'removeViewBox' }] },
    }),
  ],
});
```

### 2. Code Splitting

Already configured in `vite.config.js`:

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'charts': ['chart.js', 'react-chartjs-2'],
        'maps': ['@googlemaps/js-api-loader'],
      },
    },
  },
}
```

### 3. Enable Compression

**Vercel:** Automatic gzip/brotli

**Netlify:** Automatic

**Self-hosted:** Add nginx config:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

---

## 📊 Monitoring & Analytics

### 1. Google Analytics

```javascript
// src/utils/analytics.js
export const initGA = () => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_ID);
};

// In main.jsx
import { initGA } from './utils/analytics';
initGA();
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```javascript
// In main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🔍 SEO Optimization

### 1. Meta Tags (in index.html)

```html
<meta name="description" content="Find your dream home with Capital Real Estate - AI-powered property search">
<meta name="keywords" content="real estate, homes for sale, property search">
<meta property="og:title" content="Capital Real Estate">
<meta property="og:description" content="AI-Powered Real Estate Platform">
<meta property="og:image" content="/og-image.jpg">
```

### 2. Sitemap

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://capitalrealestate.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://capitalrealestate.com/properties</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3. robots.txt

Create `public/robots.txt`:

User-agent: *
Allow: /
Sitemap: https://capitalrealestate.com/sitemap.xml

## ✅ Post-Deployment Checklist

- [ ] Site loads correctly at production URL
- [ ] All pages are accessible
- [ ] Dark mode works
- [ ] Filters work correctly
- [ ] Images load properly
- [ ] Charts render correctly
- [ ] Mobile responsive on real devices
- [ ] SSL certificate active (HTTPS)
- [ ] Environment variables set correctly
- [ ] API endpoints working
- [ ] No console errors
- [ ] Lighthouse score 90+ (run test)
- [ ] Analytics tracking works
- [ ] Error monitoring active
- [ ] Custom domain configured (if applicable)

---

## 🧪 Test Your Deployment

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --url=https://your-site.com

# Check broken links
npm install -g broken-link-checker
blc https://your-site.com -ro
```

---

## 🆘 Troubleshooting

### Build fails

- Check Node version: `node --version`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors

### 404 on page refresh

- Vercel: Automatically handled
- Netlify: Add `_redirects` file:

  /* /index.html 200

### Environment variables not working

- Vercel/Netlify: Must start with `VITE_`
- Redeploy after adding variables
- Check variable names exactly match

### API calls failing

- Check CORS configuration
- Verify API endpoints are correct
- Check network tab for errors
- Ensure backend is deployed

---

## 🎉 You're Live

Your Capital Real Estate platform is now deployed and accessible worldwide!

**Next steps:**

1. Share your live URL
2. Monitor analytics
3. Gather user feedback
4. Iterate and improve

Good luck! 🚀🏠
