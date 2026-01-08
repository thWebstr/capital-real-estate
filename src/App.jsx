import Header from './components/Header';
import Footer from './components/Footer';


import { ThemeProvider } from './contexts/ThemeContext';
import { FilterProvider } from './contexts/FilterContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
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
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>

            <Footer />

          </div>
        </FilterProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
