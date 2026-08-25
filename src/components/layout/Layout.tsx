import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SearchModal from './SearchModal';
import { useTheme } from '../../hooks/useTheme';

export default function Layout() {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
