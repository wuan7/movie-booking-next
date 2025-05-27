'use client'

import { getMoviesWithShowing } from '../actions/movie'
import { MovieExpanded } from '../types'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type SidebarMovieListProps = {
  movieId: string
}

export default function SidebarMovieList({movieId}: SidebarMovieListProps) {
  const [movies, setMovies] = useState<MovieExpanded[]>([]);
  const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchMoviesWithShowing = async () => {
        try {
          setIsLoading(true);
          const data = await getMoviesWithShowing(movieId);
          setMovies(data);
        } catch (error) {
          console.log(error);
          toast.error("Có lỗi xảy ra!");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMoviesWithShowing();
    },[movieId]);
  return (
    <aside className="w-full  p-4 bg-white rounded-lg shadow-md border border-gray-200 space-y-4">
    <h3 className="text-xl font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
      Phim đang chiếu
    </h3>

    <div className="space-y-3">
      {isLoading && (
        <div className='flex items-center justify-center '>
          <Loader className="animate-spin size-6 text-primary" />
        </div>
      )}
      {movies.map((movie) => (
        <Link
          href={`/phim/${movie.slug}`}
          key={movie.id}
          className="flex gap-3 group hover:bg-gray-100 p-2 rounded-lg transition"
        >
          <div className="relative w-[70px] h-[100px] rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 25vw, 70px"
            />
          </div>
          <div className="flex flex-col justify-between text-gray-800">
            <h4 className="font-semibold text-sm line-clamp-2">
              {movie.title}
            </h4>
            <p className="text-xs text-gray-500">{movie.genres.map((genre) => genre.genre.name).join(", ")}</p>
            <span className="text-xs text-gray-400"> {new Date(movie.releaseDate).toLocaleDateString("vi-VN", { year: "numeric" })}</span>
          </div>
        </Link>
      ))}
    </div>
  </aside>
  )
}
