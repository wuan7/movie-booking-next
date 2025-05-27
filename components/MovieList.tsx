"use client";

import React, { useEffect, useState } from "react";
import { getMovieWithStatus } from "../actions/movie";
import { toast } from "react-toastify";
import { MovieExpanded } from "../types";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { useModal } from "../hooks/useModal";
import Link from "next/link";
import { cn } from "../lib/utils";
import { Skeleton } from "../components/ui/skeleton"; // đảm bảo bạn đã import đúng

type MovieListProps = {
  status: string;
};

const MovieList = ({ status }: MovieListProps) => {
  const [movies, setMovies] = useState<MovieExpanded[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setTrailerUrl, setOpenTrailer } = useModal();

  useEffect(() => {
    const fetchMoviesWithStatus = async () => {
      try {
        setIsLoading(true);
        const data = await getMovieWithStatus(status);
        setMovies(data);
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoviesWithStatus();
  }, [status]);

  const handleOpenTrailer = (url: string) => {
    setTrailerUrl(url);
    setOpenTrailer(true);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="w-full h-64 rounded-2xl bg-gray-200" />
        <div className="flex gap-2">
          <Skeleton className="w-10 h-5 rounded-full bg-gray-200" />
          <Skeleton className="w-12 h-5 rounded-full bg-gray-200" />
          <Skeleton className="w-8 h-5 rounded-full bg-gray-200" />
        </div>
        <Skeleton className="w-3/4 h-6 rounded-md bg-gray-200" />
        <Skeleton className="w-full h-4 rounded-md bg-gray-200" />
      </div>
    ));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
      {isLoading || movies === null
        ? renderSkeletons()
        : movies.map((movie) => (
            <Link key={movie.id} href={`/phim/${movie.slug}`}>
              <div className="group overflow-hidden rounded-2xl transition-transform duration-300 cursor-pointer hover:scale-[1.03]">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/60 group-hover:shadow-[0_0_30px_#72be43aa]">
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-2xl transition-all duration-300 group-hover:brightness-75"
                  />

                  <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                    <PlayCircle
                      className="size-10 text-primary drop-shadow"
                      onClick={() => handleOpenTrailer(movie.trailerUrl)}
                    />
                  </div>
                </div>

                <div className="mt-3 px-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-white px-2 py-0.5 rounded-full text-xs font-medium",
                        movie.ageRating === "C13" && "bg-yellow-600",
                        movie.ageRating === "P" && "bg-green-600",
                        movie.ageRating === "C16" && "bg-blue-600",
                        movie.ageRating === "C18" && "bg-red-600"
                      )}
                    >
                      {movie.ageRating}
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      Phụ đề
                    </span>
                    <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      2D
                    </span>
                  </div>
                  <h2 className="text-primary font-semibold text-lg line-clamp-2">
                    {movie.title}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Thể loại:{" "}
                    <span className="font-semibold text-primary">
                      {movie.genres
                        .map((genre) => genre.genre.name)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default MovieList;
