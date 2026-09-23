import { useState, useRef, useEffect } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type LinkType = {
  href: string;
  label: string;
};

export default function Menu({ links }: { links: LinkType[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        className="p-2 -m-2 rounded-button text-neutral-900 dark:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>
      <nav
        ref={menuRef}
        className={`bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-lg absolute top-16 left-0 w-full py-4 transition-all duration-300 ease-in-out transform z-40 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="block px-6 py-3 text-h4 text-neutral-900 dark:text-neutral-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
