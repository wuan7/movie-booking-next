"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import Image from "next/image";
import { getShowtimeWithMovieIdAndShowDate } from "../actions/showtime";
import { ShowtimeExpanded } from "../types";
import { toast } from "react-toastify";
import Showtime from "./Showtime";
import { Loader } from "lucide-react";
import { useModal } from "../hooks/useModal";
type ShowtimeSectionProps = {
  showDate: string | null;
  movieId: string;
};
const ShowtimeSection = ({ showDate, movieId }: ShowtimeSectionProps) => {
  const { setOpenShowtime, setMovieId } = useModal();

  const [showtimes, setShowtimes] = useState<ShowtimeExpanded[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const newDate = new Date(showDate as string);
  useEffect(() => {
    if (showDate && movieId) {
      const fetchShowtimes = async () => {
        try {
          setIsLoading(true);
          const data = await getShowtimeWithMovieIdAndShowDate(
            movieId,
            showDate
          );
          setShowtimes(data);
          console.log("showtimes", data);
        } catch (error) {
          console.log(error);
          toast.error("Có lỗi khi lấy suất chiếu!");
        } finally {
          setIsLoading(false);
        }
      };
      fetchShowtimes();
    }
  }, [showDate, movieId, ]);
  useEffect(() => {
    if (showtimes?.length === 0) {
      setMovieId(movieId);
      setOpenShowtime(true);
    }
  }, [movieId, showtimes?.length, showDate, setMovieId, setOpenShowtime]);
  if (isLoading || showtimes === null) {
    return (
      <div className="flex items-center justify-center gap-5 m-5">
        <Loader className="animate-spin size-6 text-primary" />
        <p className="text-sm font-bold text-primary">Đang tìm rạp chiếu...</p>
      </div>
    );
  }
  if (showtimes.length === 0)
    return (
      <p className="text-center text-sm text-gray-500 py-5 font-bold">
        Không có hãng chiếu nào vào ngày {newDate.toLocaleDateString("vi-VN")}
      </p>
    );

  return (
    <>
      <Accordion type="single" collapsible className="bg-white p-5">
        {showtimes.map((showtime) => (
          <AccordionItem value={showtime.id} key={showtime.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-x-3">
                <Image
                  src={showtime.brand.company.imageUrl}
                  alt={showtime.brand.company.name}
                  width={40}
                  height={40}
                  className="rounded-sm"
                />
                <div className="flex flex-col items-start justify-center">
                  <h1 className="font-semibold text-sm ">
                    {showtime.brand.name}
                  </h1>
                  <p className="text-xs text-gray-500 text-start">
                    {showtime.brand.address}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="mb-2 font-bold text-xs">Standard</p>
                <div className="flex flex-wrap gap-3">
                  <Showtime
                    brandId={showtime.brand.id}
                    movieId={showtime.movieId}
                    showDate={showtime.showDate}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default ShowtimeSection;
