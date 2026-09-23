import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

const Card: React.FC<CardProps> = ({ icon: Icon, title, description, href }) => {
  return (
    <Link to={href} className="relative flex items-center justify-between p-4 group">
      <div className="flex items-center gap-4">
        <Icon size={28} className="text-primary dark:text-primary-400 shrink-0" />
        <div>
          <h2 className="font-bold text-neutral-900 dark:text-neutral-50 transition-colors group-hover:text-primary dark:group-hover:text-primary-400">
            {title}
          </h2>
          <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="text-primary dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary dark:bg-primary-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
};

export default Card;
