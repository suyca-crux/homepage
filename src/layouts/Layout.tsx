import React from 'react';
import '@fontsource-variable/inter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/global.css';

import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Vipelar' }) => {
  useEffect(() => {
    document.title = title === 'Vipelar' ? title : `${title} | Vipelar`;
  }, [title]);

  return (
    <div className="antialiased min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-32 pb-24">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
