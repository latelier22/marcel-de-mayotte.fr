"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { site } from "../../site"; // Vérifie que `site.vpsServer` est bien défini
import Link from "next/link";

const ImageSlider = ({ images }) => {
  // Vérification des images
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">Aucune image disponible</p>;
  }

  // Fonction pour générer l'URL correcte en fonction de la source
  const getImageUrl = (photoUrl) => {
    if (photoUrl.startsWith("/uploads")) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${photoUrl}`;
    } else {
      return `${site.vpsServer}/images/${photoUrl}`;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto my-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Tableaux exposés en 2025</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 4000 }}
        loop={true}
        breakpoints={{
          480: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="rounded-lg shadow-lg"
        pagination={false} // ✅ Suppression des petits points
      >
        {images.map((img) => (
          <SwiperSlide key={img.id} className="flex justify-center">
            <Link href={`/catalogue/expo-2025`} className="block">
              <div className="w-full max-w-xs lg:max-w-sm xl:max-w-md mx-auto">
                <img
                  src={getImageUrl(img.url)}
                  alt={img.title || "Image"}
                  className="w-full h-72 md:h-80 lg:h-96 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
                />
                <p className="text-center text-sm mt-2 font-medium">{img.title}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
