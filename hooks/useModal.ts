"use client";
import { useAtom } from "jotai";
import {
  openSeat,
  openTrailer as Opentrailer,
  trailerUrl as TrailerUrl,
  showtimeId as ShowtimeId,
  openShowtime as OpenShowtime,
  movieId as MovieId,
} from "@/atoms/modalAtom";

export const useModal = () => {
  const [openSeats, setOpenSeats] = useAtom(openSeat);
  const [openTrailer, setOpenTrailer] = useAtom(Opentrailer);
  const [trailerUrl, setTrailerUrl] = useAtom(TrailerUrl);
  const [showtimeId, setShowtimeId] = useAtom(ShowtimeId);
  const [openShowtime, setOpenShowtime] = useAtom(OpenShowtime);
  const [movieId, setMovieId] = useAtom(MovieId);
  return {
    openSeats,
    setOpenSeats,
    openTrailer,
    setOpenTrailer,
    trailerUrl,
    setTrailerUrl,
    showtimeId,
    setShowtimeId,
    openShowtime,
    setOpenShowtime,
    movieId,
    setMovieId,
  };
};
