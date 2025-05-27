import { atom } from "jotai";
export const openSeat = atom<boolean>(false);
export const openTrailer = atom<boolean>(false);
export const trailerUrl = atom<string | null>(null);

export const showtimeId = atom<string | null>(null);
export const openShowtime = atom<boolean>(false);
export const movieId = atom<string | null>(null);