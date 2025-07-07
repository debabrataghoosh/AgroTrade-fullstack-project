'use client';

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  key: string;
  icon: string;
  label: string;
  sub: string[];
}

interface CategoriesProps {
  categories: Category[];
  onCategorySelect?: (category: string, subcategory?: string) => void;
}

// Portal component for dropdown
function DropdownPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') return null;
  return ReactDOM.createPortal(children, document.body);
}

export default function Categories({ categories, onCategorySelect }: CategoriesProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (openDropdown) setOpenDropdown(null);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openDropdown]);

  React.useEffect(() => {
    // Create portal root if not present
    if (typeof window !== 'undefined' && !document.getElementById('dropdown-portal-root')) {
      const portalRoot = document.createElement('div');
      portalRoot.id = 'dropdown-portal-root';
      document.body.appendChild(portalRoot);
    }
  }, []);

  return (
    <motion.section 
      className="w-full flex flex-col items-center bg-gradient-to-r from-green-50 via-green-100 to-green-50 py-3 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <nav className="overflow-x-auto flex items-center gap-3 sm:gap-4 py-2 select-none scrollbar-hide">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.key} 
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <motion.button
                className={`flex flex-col items-center justify-center w-[90px] sm:w-[110px] h-[80px] sm:h-[100px] px-2 py-2 bg-white rounded-2xl shadow-md border border-green-100 hover:border-green-400 hover:shadow-lg transition-all duration-200 focus:outline-none group
                  ${openDropdown === cat.key ? 'ring-2 ring-green-400 shadow-xl' : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setDropdownPos({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + rect.width / 2 + window.scrollX,
                  });
                  setOpenDropdown(openDropdown === cat.key ? null : cat.key);
                }}
                tabIndex={0}
                aria-haspopup={!!cat.sub}
                aria-expanded={openDropdown === cat.key}
              >
                <Image src={cat.icon} alt={cat.label} width={32} height={32} className="mb-1 sm:w-10 sm:h-10" />
                <span className="mt-1 text-xs font-semibold text-green-800 group-hover:text-green-600 text-center leading-tight">
                  {cat.label}
                </span>
              </motion.button>
              
              {/* Dropdown: show for all categories with subcategories */}
              <AnimatePresence>
                {Array.isArray(cat.sub) && cat.sub.length > 0 && openDropdown === cat.key && dropdownPos && (
                  <DropdownPortal>
                    <motion.div
                      className="absolute w-48 bg-white/95 backdrop-blur-lg border border-green-200 rounded-2xl shadow-2xl z-[99999] px-2 py-2 flex flex-col gap-1"
                      style={{
                        zIndex: 99999,
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        transform: 'translate(-50%, 8px)',
                        position: 'absolute',
                      }}
                      onClick={e => e.stopPropagation()}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="w-full flex flex-col gap-1">
                        {cat.sub.map((sub, i) => (
                          <motion.li
                            key={i}
                            className="px-3 py-2 text-green-800 hover:bg-green-100 hover:text-green-700 active:bg-green-200 cursor-pointer break-words max-w-full transition-all duration-150 rounded-lg font-semibold text-sm text-center border border-transparent hover:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                            tabIndex={0}
                            onClick={() => onCategorySelect && onCategorySelect(cat.label, sub)}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                          >
                            {sub}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </DropdownPortal>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.section>
  );
} 