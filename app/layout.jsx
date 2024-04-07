import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import './page.module.css';
import { site } from './site';

const inter = Inter({ subsets: ['latin'] });

const siteMetadata = site;

export default function RootLayout({
  children
}) 
{
  const siteTitle = siteMetadata.title;
  const siteDescription = siteMetadata.description;

  const title = `${siteTitle}`;
  const description = `${siteDescription}`;
  // const title = `${siteTitle} | ${pageTitle || ''}`;
  // const description = `${siteDescription} | ${pageDescription || ''}`;

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Add other meta tags if needed */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=BioRhyme:wght@200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-texte bg-white dark:bg-neutral-900">
        {children}
      </body>
    </html>
  );
};
