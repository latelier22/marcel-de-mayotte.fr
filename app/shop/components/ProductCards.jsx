"use client";

import React from "react";
import Link from "next/link";
const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;

const ProductCards = ({ products }) => {
  return (
    <div className="container mx-auto my-12 p-8 rounded-md dark:bg-black border-gold-500 border-solid border-2 animate-fadeInOut">
      <h2 className="text-2xl font-bold mb-6">Vos produits dérivés favoris</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const imageUrl = product.images?.[0]?.url;
          return (
            <Link href={`${baseUrl}/redirect-to-product/${product.code}`} key={product.id}>
  <div
    className="bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden border border-neutral-200 dark:border-neutral-700 group"
  >
    {imageUrl && (
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:object-contain transition-all duration-300"
        />
      </div>
    )}
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
        Code : {product.code}
      </p>
      <p className="text-gold-800 font-bold">
        {(product.price / 100).toFixed(2)} €
      </p>
    </div>
  </div>
</Link>

          );
        })}
      </div>
    </div>
  );
};

export default ProductCards;
