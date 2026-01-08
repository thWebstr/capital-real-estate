import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

import { ThemeProvider } from './contexts/ThemeContext';
import { FilterProvider } from './contexts/FilterContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import FavoritesPage from './pages/FavoritesPage';

import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <FilterProvider>
          <div className="app">
            <Header />

            {/* ROUTES GO HERE */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>

            <Footer />
            <AIAssistant />
          </div>
        </FilterProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
