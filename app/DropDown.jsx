import React, { useState } from 'react';
import Link from 'next/link';

export default function Dropdown({ item }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuItems = item?.children ? item.children : [];

    const toggle = () => {
        setIsOpen(old => !old);
    };

    console.log("ITEM", item);
    console.log("isOpen state:", isOpen);

    return (
        <>
            <div className="relative">
                <button
                    className="hover:text-blue-400"
                    onClick={toggle}
                >
                    {item.label}
                </button>
                <div className={`absolute top-8 z-30  flex flex-col py-4 bg-black rounded-md ${isOpen ? "flex" : "hidden"}`}>
                    {menuItems.map(child => (
                        <Link
                            key={child.route}
                            href={child.route}
                            className="hover:bg-red-800 hover:text-gold-500 px-4 py-1"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the dropdown from closing when clicking a link
                                toggle();
                            }}
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            </div>
            {isOpen && (
                <div
                    className="fixed top-0 right-0 bottom-0 left-0 z-20"
                    onClick={toggle}
                ></div>
            )}
        </>
    );
}
