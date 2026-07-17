


"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  { name: "Lauritz Knudsen (L&T Switchgears)", image: "/images/banner/l_t_switchgear.png" },
  { name: "Polycab Wires & Cables", image: "/images/banner/polycab.png" },
  { name: "Salzer", image: "/images/banner/salzer.png" },
  { name: "GIC", image: "/images/banner/gic.png" },
];

export default function HeroSlider() {
  return (
    <section className="px-3 md:px-8 -mt-1">
      <div className="mx-auto max-w-[1500px] rounded-3xl overflow-hidden shadow-md relative hero-swiper">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[300px] md:h-[520px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.name}>
              <img src={slide.image} alt={slide.name} className="h-full w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}