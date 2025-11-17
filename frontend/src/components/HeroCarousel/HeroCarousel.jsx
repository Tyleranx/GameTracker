// src/components/HeroCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Importa los componentes de Swiper
import { Pagination, Autoplay } from 'swiper/modules'; // Importa los módulos necesarios (paginación, autoplay)

// Importa los estilos base de Swiper
import 'swiper/css';
import 'swiper/css/pagination'; // Estilos para la paginación
import './HeroCarousel.css'; // Nuestros estilos personalizados

// --- Importa tus imágenes aquí ---
// (Asegúrate de tener estas imágenes en tu carpeta src/assets/)
import banner1 from '../../assets/expedition-banner.jpg'; // La de tu maqueta
import banner2 from '../../assets/banner2.jpg'; // Reemplaza con tus imágenes reales
import banner3 from '../../assets/banner3.jpg';
import banner4 from '../../assets/banner4.jpg';
// Si solo tienes una, puedes importar la misma 4 veces para probar.


const HeroCarousel = () => {
  const banners = [
    { id: 1, image: banner1, alt: 'Expedition 33' },
    { id: 2, image: banner2, alt: 'Banner de juego 2' },
    { id: 3, image: banner3, alt: 'Banner de juego 3' },
    { id: 4, image: banner4, alt: 'Banner de juego 4' },
  ];

  return (
    <div className="hero-carousel-wrapper">
      <Swiper
        // Módulos que vamos a usar
        modules={[Pagination, Autoplay]}
        // Opciones del carrusel
        spaceBetween={0} // Sin espacio entre slides
        slidesPerView={1} // Muestra una slide a la vez
        pagination={{ clickable: true }} // Habilita los puntos de paginación
        loop={true} // El carrusel se repite infinitamente
        autoplay={{
          delay: 5000, // Cada 5 segundos cambia de slide
          disableOnInteraction: false, // El autoplay no se detiene si el usuario interactúa
        }}
        className="mySwiper" // Clase para nuestro Swiper
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="carousel-slide-content">
              <img src={banner.image} alt={banner.alt} className="carousel-image" />
              {/* Aquí podrías añadir texto superpuesto, títulos, botones, etc. */}
              {/* <div className="carousel-overlay-text">
                  <h2>{banner.alt}</h2>
                  <p>¡Descubre la aventura!</p>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;