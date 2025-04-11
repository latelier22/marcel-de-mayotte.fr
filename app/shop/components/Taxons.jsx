'use client';

import React from 'react';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;

export default function Taxons({ taxons }) {
  return (
    <div className="container mx-auto my-12 p-8 rounded-md bg-cyan-500 border-gold-500 border-solid border-2 animate-fadeInOut">
      
      {/* Titre centré */}
      <Link href={`${baseUrl}`}>
        <h2 className="text-2xl font-bold mb-8 text-center text-orange-600 hover:text-yellow-900 transition">
          Retrouvez mes œuvres en reproduction haute définition <br/> et en produits dérivés de qualité sur ma boutique en ligne
        </h2>
      </Link>
      
      {/* Ligne de catégories */}
      <ul className="flex flex-wrap justify-center items-center gap-4">
        {taxons.map((taxon) => (
          <li key={taxon.id}>
            <Link href={`${baseUrl}/fr_FR/taxons/${taxon.slug}`}>
              <span className="inline-block px-6 py-3 border border-orange-600 bg-yellow-500 rounded-md text-orange-600 hover:bg-orange-600 hover:text-yellow-500 transition">
                {taxon.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
