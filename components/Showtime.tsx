"use client";
import { getShowtimeWithBrandId } from "../actions/showtime";

import { ShowtimeExpanded } from "../types";
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import { format } from 'date-fns-tz';
import { useModal } from "../hooks/useModal";
import { Loader } from "lucide-react";
type Showtimeprops = {
  brandId: string;
  movieId: string;
  showDate: Date;
};
const Showtime = ({ brandId, movieId, showDate }: Showtimeprops) => {
  const [showtimes, setShowtimes] = useState<ShowtimeExpanded[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setOpenSeats, setShowtimeId } = useModal();

  useEffect(() => {
    if (showDate && movieId && brandId) {
      const fetchShowtimes = async () => {
        try {
          setIsLoading(true);
          const data = await getShowtimeWithBrandId(movieId, showDate, brandId);
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
  }, [showDate, movieId, brandId]);

  const handleOpenShowtime = (showtimeId: string) => {
      setOpenSeats(true);
      setShowtimeId(showtimeId);
  };
  if(isLoading) return (
    <div className="flex items-center justify-center gap-5 m-5">
        <Loader className="animate-spin size-6 text-primary" />
        <p className="text-sm font-bold text-primary">Đang tìm suất chiếu...</p>
      </div>
  )
  return (
   
      <>
      {showtimes?.map((showtime) => (
        <Button key={showtime.id} className="cursor-pointer" onClick={() => handleOpenShowtime(showtime.id)}>
          {format(new Date(showtime.startTime), "HH:mm")} ~{" "}
          {format(new Date(showtime.endTime), "HH:mm")}
        </Button>
      ))}
 
      </>

  );
};

export default Showtime;
