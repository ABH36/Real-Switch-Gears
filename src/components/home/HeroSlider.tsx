// "use client";

// import { useRef } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import type { Swiper as SwiperType } from "swiper";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// const slides = [
//   { name: "Lauritz Knudsen (L&T Switchgears)", image: "/images/banner/l_t_switchgear.jpg" },
//   { name: "Polycab Wires & Cables", image: "/images/banner/polycab.jpg" },
//   { name: "Salzer", image: "/images/banner/salzer.jpg" },
//   { name: "GIC", image: "/images/banner/gic.jpg" },
//   { name: "Braco", image: "/images/banner/braco.jpg" },
//   { name: "Newtek", image: "/images/banner/newtek_electricals.jpg" },
//   { name: "Connectwell", image: "/images/banner/connectwell.jpg" },
//   { name: "Esbee", image: "/images/banner/esbee.jpg" },

// ];

// export default function HeroSlider() {
//   const swiperRef = useRef<SwiperType | null>(null);

//   return (
//     <section className="px-3 md:px-4 -mt-1">
//       <div className="mx-auto max-w-[1500px] rounded-3xl overflow-hidden shadow-sm md:shadow-md relative hero-swiper group">
//         <Swiper
//           modules={[Autoplay, Pagination]}
//           onSwiper={(s) => (swiperRef.current = s)}
//           speed={700}
//           autoplay={{ delay: 4000, disableOnInteraction: false }}
//           pagination={{ clickable: true }}
//           loop
//           grabCursor
//           threshold={5}
//           resistanceRatio={0.65}
//           className="aspect-[16/9] md:aspect-auto md:h-[520px]"
//         >
//           {slides.map((slide, i) => (
//             <SwiperSlide key={slide.name} className="relative">
//               <Image
//                 src={slide.image}
//                 alt={slide.name}
//                 fill
//                 loading={i === 0 ? "eager" : "lazy"}
//                 fetchPriority={i === 0 ? "high" : undefined}
//                 sizes="(max-width: 768px) 100vw, 1500px"
//                 className="object-fit select-none pointer-events-none"
//                 draggable={false}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         <button
//           type="button"
//           aria-label="Previous slide"
//           onClick={() => swiperRef.current?.slidePrev()}
//           className="hero-nav-btn left-2 md:left-5"
//         >
//           <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
//         </button>
//         <button
//           type="button"
//           aria-label="Next slide"
//           onClick={() => swiperRef.current?.slideNext()}
//           className="hero-nav-btn right-2 md:right-5"
//         >
//           <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
//         </button>
//       </div>
//     </section>
//   );
// }



"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

const slides = [
  { name: "Lauritz Knudsen (L&T Switchgears)", image: "/images/banner/l_t_switchgear.jpg" },
  { name: "Polycab Wires & Cables", image: "/images/banner/polycab.jpg" },
  { name: "Salzer", image: "/images/banner/salzer.jpg" },
  { name: "GIC", image: "/images/banner/gic.jpg" },
  { name: "Braco", image: "/images/banner/braco.jpg" },
  { name: "Newtek", image: "/images/banner/newtek_electricals.jpg" },
  { name: "Connectwell", image: "/images/banner/connectwell.jpg" },
  { name: "Esbee", image: "/images/banner/esbee.jpg" },
];

export default function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="px-3 md:px-4 -mt-1">
      <div className="mx-auto max-w-[1500px] relative hero-swiper group">
        <Swiper
          modules={[Autoplay, Pagination, EffectCreative]}
          onSwiper={(s) => (swiperRef.current = s)}
          speed={800}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          grabCursor
          effect="creative"
          creativeEffect={{
            limitProgress: 1,
            prev: {
              translate: ["-105%", 0, -1],
              scale: 0.92,
              opacity: 0.5,
            },
            next: {
              translate: ["105%", 0, -1],
              scale: 0.92,
              opacity: 0.5,
            },
          }}
          className="aspect-[16/9] md:aspect-auto md:h-[520px]"
        >
          {slides.map((slide, i) => (
            <SwiperSlide
              key={slide.name}
              className="relative overflow-hidden rounded-3xl"
            >
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                sizes="(max-width: 768px) 100vw, 1500px"
                className="object-fit select-none pointer-events-none"
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.slidePrev()}
          className="hero-nav-btn left-2 md:left-5"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiperRef.current?.slideNext()}
          className="hero-nav-btn right-2 md:right-5"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}