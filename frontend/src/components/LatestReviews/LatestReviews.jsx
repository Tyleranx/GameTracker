import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ReviewCard from '../ReviewCard/ReviewCard';
import 'swiper/css';
import 'swiper/css/navigation';
import './LatestReviews.css';

const LatestReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/latest`);
        const data = await res.json();
        if (res.ok) {
          setReviews(data);
        }
      } catch (err) {
        console.error('Error cargando últimas reseñas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestReviews();
  }, []);

  if (loading) return <p>Cargando reseñas...</p>;
  if (reviews.length === 0) return null; // No mostrar nada si no hay reseñas

  return (
    <section className="latest-reviews-section">
      <h2>Últimas Reseñas</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20} // Espacio entre tarjetas
        slidesPerView={'auto'} // Muestra tantas como quepan
        navigation={true}
        className="reviews-swiper-container"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id} className="review-swiper-slide">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LatestReviews;