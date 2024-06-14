import React, { useState } from 'react';
import Link from 'next/link';

const Dropdown = ({ item, isSubMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = item.children ? item.children : [];

  const toggle = () => {
    setIsOpen(old => !old);
  };

  return (
    <div className={`relative ${isSubMenu ? 'ml-4' : ''}`}>
      <button className="p-2 font-lien nav-button text-gold-200 hover:text-blue-400 flex items-center" onClick={toggle}>
        {item.label}
        {menuItems.length > 0 && (
          <span className="ml-2">
            {isSubMenu ? '▶' : '▼'}
          </span>
        )}
      </button>
      <div className={`absolute top-8 ${isSubMenu ? 'left-full -top-2' : 'left-0'} z-30 flex flex-col py-4 bg-black rounded-md ${isOpen ? 'flex' : 'hidden'}`}>
        {menuItems.map(child => (
          child.children && child.children.length > 0 ? (
            <Dropdown key={child.id} item={child} isSubMenu={true} />
          ) : (
            <Link
              key={child.id}
              href={child.route}
              className="hover:bg-red-800 hover:text-gold-500 px-4 py-1"
              onClick={e => {
                e.stopPropagation(); // Prevent the dropdown from closing when clicking a link
                setIsOpen(false);
              }}
            >
              {child.label}
            </Link>
          )
        ))}
      </div>
      {isOpen && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-20" onClick={toggle}></div>
      )}
    </div>
  );
};

export default Dropdown;
