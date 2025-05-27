// components/CastCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCastWithCast } from "../types";

type CastCarouselProps = {
  castList: MovieCastWithCast[];
};

export default function CastCarousel({ castList }: CastCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
        <h1 className="text-2xl font-bold mb-4">Diễn viên & Đoàn làm phim</h1>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {castList.map((cast) => (
            <div className="min-w-[150px] flex-shrink-0 p-2" key={cast.cast.id}>
              <div className="rounded-lg overflow-hidden shadow-md bg-white p-3 text-center">
                <div className="w-[120px] h-[120px] mx-auto rounded-full overflow-hidden">
                  <Image
                    src={cast.cast.imageUrl}
                    alt={cast.cast.name}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="mt-2 font-semibold text-sm">{cast.cast.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 -left-2 -translate-y-1/2 bg-white rounded-full p-1 shadow z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 -right-2 -translate-y-1/2 bg-white rounded-full p-1 shadow z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
