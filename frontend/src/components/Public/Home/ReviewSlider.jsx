import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  FaStar,
  FaCheckCircle,
  FaQuoteLeft,
  FaCommentDots,
} from "react-icons/fa"; // NAYA JADOO: Icon add kiya
import { Link } from "react-router-dom";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/reviews`);
        if (response.data.success) {
          setReviews(response.data.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching reviews for slider:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white dark:bg-snap-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Loved by{" "}
            <span className="text-yellow-500 dark:text-snap-yellow">
              Thousands
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            See what our verified buyers have to say about their experience.
          </p>
        </div>

        {/* SWIPER */}
        <div className="pb-10">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper pb-12!"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id} className="h-auto">
                <div className="bg-gray-50 dark:bg-snap-card rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 relative flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                  <FaQuoteLeft className="absolute top-6 right-6 text-4xl text-gray-200 dark:text-gray-800/50" />

                  <div className="flex mb-4 relative z-10">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < review.rating
                            ? "text-yellow-500 dark:text-snap-yellow"
                            : "text-gray-300 dark:text-gray-700"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed relative z-10 grow italic">
                    "
                    {review.comment.length > 120
                      ? review.comment.substring(0, 120) + "..."
                      : review.comment}
                    "
                  </p>

                  <hr className="border-gray-200 dark:border-gray-800 mb-4" />

                  {/* USER INFO & CONTACT BUTTON */}
                  <div className="flex justify-between items-center mt-auto relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 dark:bg-snap-yellow flex items-center justify-center text-black font-black text-xl">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-sm">
                          {review.name}
                          {review.isVerifiedPurchase && (
                            <FaCheckCircle
                              className="text-green-500 text-xs"
                              title="Verified"
                            />
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Verified Buyer
                        </p>
                      </div>
                    </div>

                    {/* NAYA JADOO: Contact Buyer Button (Chota wala) */}
                    {review.socialLink && (
                      <a
                        href={review.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold bg-white dark:bg-gray-800 hover:bg-yellow-500 dark:hover:bg-snap-yellow border border-gray-200 dark:border-gray-700 hover:border-transparent text-gray-700 dark:text-white hover:text-black py-1.5 px-3 rounded-full transition-all flex items-center gap-1 shadow-sm"
                        title="Contact this buyer to verify"
                      >
                        <FaCommentDots /> Ask Me
                      </a>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* VIEW ALL REVIEWS BUTTON */}
        <div className="text-center mt-4">
          <Link
            to="/reviews"
            className="inline-block bg-transparent hover:bg-yellow-500 dark:hover:bg-snap-yellow text-gray-900 dark:text-white hover:text-black font-bold py-3 px-8 rounded-full border-2 border-yellow-500 dark:border-snap-yellow transition-all duration-300"
          >
            Read All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReviewSlider;
