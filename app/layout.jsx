// app/layout.jsx

"use client"

import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import './page.module.css';
import 'react-quill/dist/quill.snow.css';
import { site } from './site';

import { NextAuthProvider} from "@/utils/NextAuthProvider"
import ReduxProvider from "./ReduxProvider";
import useMenuStore from './store/useStore';
import fetchMenus from "./components/fetchMenus"; // Assurez-vous que le chemin est correct
import { Layout } from '@/components/dom/Layout'
import '@/app/global.css'

const inter = Inter({ subsets: ['latin'] });

const siteMetadata = site;

const AppInitializer = ({ children }) => {
  const setMenus = useMenuStore((state) => state.setMenus);

  useEffect(() => {
    const initializeMenus = async () => {
      const menuItems = await fetchMenus();
      
      setMenus(menuItems);
    };
    initializeMenus();
  }, [setMenus]);

  return children;
};

export default function RootLayout({ children }) {
  const siteTitle = siteMetadata.title;
  const siteDescription = siteMetadata.description;
  const title = `${siteTitle}`;
  const description = `${siteDescription}`;

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Add other meta tags if needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=BioRhyme:wght@200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-texte bg-white dark:bg-neutral-900">
        <ReduxProvider>
          <NextAuthProvider>
            <AppInitializer>
              <Layout>
              {children}

              </Layout>
            </AppInitializer>
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
