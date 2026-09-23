import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-16 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-caption text-neutral-500 dark:text-neutral-400 font-medium">
          &copy; 2025-{new Date().getFullYear()} Vipelar. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
