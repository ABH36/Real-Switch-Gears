


"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, Navigation, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

const slides = [
  { name: "Lauritz Knudsen (L&T Switchgears)", image: "/images/banner/l_t_switchgear.png" },
  { name: "Polycab Wires & Cables", image: "/images/banner/polycab.png" },
  { name: "Salzer", image: "/images/banner/salzer.png" },
  { name: "GIC", image: "/images/banner/gic.png" },
];

export default function HeroSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="px-3 md:px-8 -mt-1">
      <div className="mx-auto max-w-[1500px] rounded-3xl overflow-hidden shadow-md relative hero-swiper group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: { shadow: false, translate: [0, 0, 0], scale: 0.82, opacity: 0 },
            next: { shadow: false, translate: [0, 0, 0], scale: 0.82, opacity: 0 },
          }}
          speed={900}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onBeforeInit={(swiper: SwiperType) => {
            // @ts-expect-error swiper types expect navigation params to already be an object
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-expect-error swiper types expect navigation params to already be an object
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation
          loop
          grabCursor
          className="h-[300px] md:h-[520px]"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.name} className="relative">
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="(max-width: 768px) 100vw, 1500px"
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation arrows */}
        <button
          ref={prevRef}
          aria-label="Previous slide"
          className="hero-nav-btn left-3 md:left-5"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
        </button>
        <button
          ref={nextRef}
          aria-label="Next slide"
          className="hero-nav-btn right-3 md:right-5"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
