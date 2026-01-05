# 🚀 Capital Real Estate - Complete Setup Guide

This guide will walk you through setting up the Capital Real Estate platform from scratch.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git**
- A code editor (VS Code recommended)

Check your versions:

```bash
node --version
npm --version
git --version
```

---

## 🛠️ Installation Steps

### 1. Create New Vite + React Project

```bash
# Create new project
npm create vite@latest capital-real-estate -- --template react

# Navigate to project directory
cd capital-real-estate
```

### 2. Install Dependencies

```bash
# Install core dependencies
npm install

# Install additional packages
npm install chart.js react-chartjs-2 @googlemaps/js-api-loader lucide-react
```

### 3. Create Project Structure

Create the following folders inside `src/`:

```bash
mkdir src/components
mkdir src/contexts
mkdir src/data
mkdir src/styles
mkdir src/hooks
mkdir src/utils
```

### 4. Add Files

Copy all the generated artifact files into their respective locations:

**Root Directory:**

- `package.json`
- `vite.config.js`
- `index.html`
- `.env.example`

**src/ Directory:**

- `main.jsx`
- `App.jsx`

**src/styles/:**

- `global.css`

**src/contexts/:**

- `ThemeContext.jsx`
- `FilterContext.jsx`
- `FavoritesContext.jsx`

**src/components/:**

- `Header.jsx`
- `Hero.jsx`
- `PropertyCard.jsx`
- `PropertyList.jsx`
- `FilterPanel.jsx`
- `MarketDashboard.jsx`
- `AIAssistant.jsx`
- `Footer.jsx`

**src/data/:**

- `properties.js`

### 5. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys
# You'll need:
# - Google Maps API Key
# - Anthropic API Key (for AI features)
```

---

## 🔑 Getting API Keys

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the key and add to `.env`:

   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

**Important:** Restrict your API key:

- Set HTTP referrers (e.g., `localhost:5173/*`)
- Limit to specific APIs

### Anthropic API Key (for AI Features)

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and add to `.env`:

   ```env
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

**Note:** For production, you should proxy API calls through a backend to keep keys secure.

---

## 🎨 Font Awesome Setup

Font Awesome is loaded via CDN in `index.html`. No additional setup needed!

The following icon styles are available:

- Solid: `fas fa-icon-name`
- Regular: `far fa-icon-name`
- Brands: `fab fa-icon-name`

---

## 🚦 Running the Application

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Final Project Structure

```text

capital-real-estate/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── PropertyCard.jsx
│   │   ├── PropertyList.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── MarketDashboard.jsx
│   │   ├── AIAssistant.jsx
│   │   └── Footer.jsx
│   ├── contexts/
│   │   ├── ThemeContext.jsx
│   │   ├── FilterContext.jsx
│   │   └── FavoritesContext.jsx
│   ├── data/
│   │   └── properties.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md

```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Chart.js not rendering

**Solution:**
Make sure you've registered Chart.js components:

```javascript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

### Issue: Dark mode not working

**Solution:**
Check that `data-theme` attribute is being set on `<html>`:

```javascript
document.documentElement.setAttribute('data-theme', theme);
```

### Issue: Google Maps not loading

**Solution:**

1. Verify API key is correct in `.env`
2. Check that Maps JavaScript API is enabled
3. Verify domain restrictions allow localhost
4. Check browser console for specific error

### Issue: Styles not applying correctly

**Solution:**
Make sure `global.css` is imported in `App.jsx`:

```javascript
import './styles/global.css';
```

---

## 🔒 Security Best Practices

### For Development

1. Never commit `.env` file to Git
2. Use `.env.example` as template
3. API keys in `.env` are fine for local development

### For Production

1. **DO NOT expose API keys in frontend code**
2. Set up a backend proxy for API calls:

   ```text
   Frontend → Your Backend → Anthropic/Google APIs
   ```

3. Use environment variables in hosting platform (Vercel, Netlify, etc.)
4. Implement rate limiting
5. Add request authentication

### Example Backend Proxy (Node.js)

```javascript
// server.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ai-chat', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Secure!
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Add environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env`
3. Redeploy

### Deploy to Netlify

```bash
# Build the project
npm run build

# Drag and drop 'dist' folder to Netlify
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## ✅ Testing Checklist

Before going live, test these features:

- [ ] Dark mode toggle works
- [ ] Search filters properties correctly
- [ ] Favorites persist after page refresh
- [ ] Property cards display correctly
- [ ] Charts render on Market Insights page
- [ ] AI Assistant responds (if backend configured)
- [ ] Mobile responsive (test on different screen sizes)
- [ ] All links work
- [ ] Images load correctly
- [ ] Forms validate input
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Font Awesome Icons](https://fontawesome.com/icons)

---

## 🆘 Need Help?

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify all dependencies** are installed: `npm list`
3. **Clear cache**: Delete `node_modules`, `.vite`, and reinstall
4. **Check environment variables** are correctly set
5. **Review the documentation** for specific features

---

## 🎉 You're All Set

Your Capital Real Estate platform should now be running successfully.

Next steps:

1. Customize the sample property data in `src/data/properties.js`
2. Configure AI Assistant with your Anthropic API key
3. Add more features from the original spec
4. Deploy to production!

Happy coding! 🏠✨
