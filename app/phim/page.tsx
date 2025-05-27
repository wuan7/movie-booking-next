"use client";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../.././components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../.././components/ui/select";

import { getGenres } from "../.././actions/genre";
import { Loader, PlayCircle } from "lucide-react";
import { MovieExpanded } from "../.././types";
import { useEffect, useState } from "react";
import { useModal } from "../.././hooks/useModal";
import { getMoviesWithPagination } from "../.././actions/movie";
import Link from "next/link";
import { cn } from "../.././lib/utils";
import { Genre, Nation } from "../.././lib/generated/prisma";
import { getNations } from "../.././actions/nation";

const MoviePage = () => {
  const [movies, setMovies] = useState<MovieExpanded[] | null>(null);
  const { setTrailerUrl, setOpenTrailer } = useModal();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("NOW_SHOWING");
  const [genre, setGenre] = useState("default");
  const [nation, setNation] = useState("default");
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [nations, setNations] = useState<Nation[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const { movies, totalPages } = await getMoviesWithPagination(
          page,
          10,
          status,
          genre,
          nation
        );
        setMovies(movies);
        setTotalPages(totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [page, status, genre, nation]);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchNations = async () => {
      try {
        const data = await getNations();
        setNations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGenres();
    fetchNations();
  }, []);
  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    setPage(1);
  };

  const handleNationChange = (value: string) => {
    setNation(value);
    setPage(1);
  };
  const handleOpenTrailer = (url: string) => {
    setTrailerUrl(url);
    setOpenTrailer(true);
  };
  return (
    <div className="max-w-6xl mx-auto mb-5">
      <div className="bg-white my-5 flex md:flex-row flex-col md:items-center gap-y-2 md:gap-0 justify-between p-3 dark:bg-[#0f0f0f] dark:shadow-sm dark:shadow-white/10">
        <h1 className="text-sm">Sắp xếp phim</h1>
        <div className="flex flex-wrap gap-3 md:gap-x-2">
          <div>
            <Select defaultValue={genre} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Tất cả thể loại</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select defaultValue={nation} onValueChange={handleNationChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Tất cả quốc gia</SelectItem>
                {nations.map((nation) => (
                  <SelectItem key={nation.id} value={nation.name}>
                    {nation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              defaultValue={status}
              value={status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOW_SHOWING">Phim đang chiếu</SelectItem>
                <SelectItem value="COMING_SOON">Phim sắp chiếu</SelectItem>
                <SelectItem value="STOPPED">Phim đã ngừng chiếu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
        {isLoading || movies === null ? (
          <div className="flex items-center flex-col justify-center col-span-full py-10 max-w-7xl mx-auto">
            <Loader className="animate-spin text-primary" />
          </div>
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10 text-sm font-bold">
            Không tìm thấy phim phù hợp.
          </div>
        ) : (
          movies.map((movie) => (
            <>
              <Link key={movie.id} href={`/phim/${movie.slug}`}>
                <div className="group overflow-hidden rounded-2xl transition-transform duration-300 cursor-pointer hover:scale-[1.03]">
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/60 group-hover:shadow-[0_0_30px_#72be43aa]">
                    {/* Ảnh */}
                    <Image
                      src={movie.imageUrl}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-2xl transition-all duration-300 group-hover:brightness-75"
                    />

                    {/* Overlay nút khi hover */}
                    <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                      <PlayCircle
                        className="size-10 text-primary drop-shadow"
                        onClick={() => handleOpenTrailer(movie.trailerUrl)}
                      />
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="mt-3 px-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          " text-white px-2 py-0.5 rounded-full text-xs font-medium",
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
                    <h2 className="text-primary font-semibold text-lg">
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
            </>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={page === idx + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(idx + 1);
                  }}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default MoviePage;
