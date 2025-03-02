"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { site } from "../../site"; // Assure-toi que `site` contient bien `vpsServer`
import Link from "next/link";

const API_URL = "https://proxy.latelier22.fr/https://www.marcel-de-mayotte.fr/api/getImagesByTag/89";

const ImageSlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data && data.tagImages) {
          setImages(data.tagImages);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des images :", error);
      }
    };

    fetchImages();
  }, []);

  // Fonction pour générer l'URL correcte en fonction de la source
  const getImageUrl = (photoUrl) => {
    if (photoUrl.startsWith("/uploads")) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${photoUrl}`;
    } else {
      return `${site.vpsServer}/images/${photoUrl}`;
    }
  };

  return (
    <div className="max-w-8xl mx-auto my-8 px-8">
      <h2 className="text-2xl font-bold text-center mb-4">Tableaux exposés en 2025</h2>
      {images.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="rounded-lg shadow-lg"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id}>
              <div className="mx-auto p-20">
                <Link href={`/catalogue/expo-2025`}>
                <img
                  src={getImageUrl(img.url)} // 🔥 Utilisation de la fonction dynamique
                  alt={img.title || "Image"}
                  className="h-96 w-auto object-cover rounded-lg shadow-md" // 🔥 Hauteur fixe, largeur auto, bonne mise en page
                  />
                <p className="text-sm mt-2">{img.title}</p>
                  </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center">Aucune image disponible</p>
      )}
    </div>
  );
};

export default ImageSlider;
