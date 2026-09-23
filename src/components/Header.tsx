import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const links = [{ href: '/magniquake', label: 'Magniquake' }];

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-neutral-950 z-50 transition-colors border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex justify-between items-center h-16">
        <div className="flex gap-x-2 items-center">
          <Link
            to="/"
            className="flex items-center gap-x-2 hover:opacity-80 transition-opacity font-bold text-neutral-900 dark:text-neutral-50"
          >
            <img src="/favicon.ico" width={40} height={40} alt="logo" className="rounded-card" />
            <span className="text-h4 font-bold">Vipelar</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden space-x-6 md:flex">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className="inline-flex items-center text-neutral-900 dark:text-neutral-50 hover:text-primary dark:hover:text-primary-400 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Menu links={links} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
