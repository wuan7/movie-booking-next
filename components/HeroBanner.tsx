"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getBanners } from "../actions/banner";
import { BannerWithMovie } from "../types";
import Link from "next/link";

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [banners, setBanners] = useState<BannerWithMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const data = await getBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi) return;

    intervalRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden">
      <div
        ref={emblaRef}
        className="embla w-full h-[200px] sm:h-[270px] md:h-[370px] lg:h-[480px] xl:h-[600px] touch-pan-y"
      >
        <div className="embla__container flex h-full">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="embla__slide flex-[0_0_100%] h-full animate-pulse bg-gray-300"
                />
              ))
            : banners.map((banner) => (
                <Link
                  href={`/phim/${banner.movie.slug}`}
                  key={banner.id}
                  className="embla__slide relative flex-[0_0_100%] h-full cursor-pointer pointer-events-auto"
                >
                  <Image
                    src={banner.imageUrl}
                    alt={`Banner ${banner.movie.title}`}
                    fill
                    className="object-fill"
                    sizes="100vw"
                    priority={banner.id === banners[0]?.id}
                  />
                </Link>
              ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 pointer-events-none">
        <button
          onClick={scrollPrev}
          className="z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
