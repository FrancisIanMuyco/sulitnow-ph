import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import SearchModal from './SearchModal';
import BackToTop from '../common/BackToTop';
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
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      <BottomNav />
      <BackToTop />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
