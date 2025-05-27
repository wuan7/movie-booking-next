"use client";
import React, { useEffect, useState } from "react";
import StickyBox from "react-sticky-box";
import Image from "next/image";
import { Loader, PlayCircle } from "lucide-react";
import DateBox from "../.././../components/DateBox";
import ShowtimeSection from "../.././../components/ShowtimeSection";
import SidebarMovieList from "../.././../components/SidebarMovieList";
import { useParams } from "next/navigation";
import { getMovieById } from "../.././../actions/movie";
import { MovieExpanded } from "../.././../types";
import { useModal } from "../.././../hooks/useModal";
import CastCarousel from "../.././../components/CastCarousel";
import Review from "../.././../components/Review";
import PostCards from "../.././../components/PostCards";
import Link from "next/link";
import { Button } from "../.././../components/ui/button";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieExpanded | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setTrailerUrl, setOpenTrailer } = useModal();
  const [showDate, setShowDate] = useState<string | null>(null);
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        const data = await getMovieById(id as string);
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id]);
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} | Thông tin lịch chiếu - giá vé`;
    }
  }, [movie]);

  useEffect(() => {
   
     const wakeUpServer = async () => {
        try {
          await fetch(process.env.BACKEND_URL || "https://movie-booking-worker.onrender.com");
        } catch (err) {
          console.error("Lỗi wake-up server:", err);
        }
      };
  
      wakeUpServer();
  }, []);
  const handleOpenTrailer = (url: string) => {
    setTrailerUrl(url);
    setOpenTrailer(true);
  };

  if (isLoading || movie == null) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader className="animate-spin size-6 text-primary" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-2xl font-bold text-primary">Không tìm thấy phim</p>
      </div>
    );
  }
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md">
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle
              className="size-10 text-primary drop-shadow animate-ping cursor-pointer"
              onClick={() => handleOpenTrailer(movie.trailerUrl)}
            />
          </div>
        </div>

        {/* Nội dung */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-6 bg-white p-3">
          <div className="">
            <h1 className="text-3xl font-bold text-primary">{movie.title}</h1>
            <div className="mt-4 space-y-2 text-gray-600">
              <p className="text-primary font-bold">
                <span className="font-semibold text-black">Thể loại:</span>{" "}
                {movie.genres.map((genre) => genre.genre.name).join(", ")}
              </p>
              <p className="text-primary font-bold">
                <span className="font-semibold text-black">Thời lượng:</span>{" "}
                {movie.duration} phút
              </p>
              <p className="text-primary font-bold">
                <span className="font-semibold text-black">Khởi chiếu:</span>{" "}
                {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-primary font-bold">
                <span className="font-semibold text-black">Đạo diễn:</span>{" "}
                {movie.director}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Nội dung phim
            </h2>
            <p className="text-gray-700 leading-relaxed">{movie.description}</p>
          </div>
        </div>
      </div>

      
      <div className="flex md:flex-row flex-col w-full items-start gap-x-1 mt-5">
        <div className="md:w-2/3 w-full  ">
          <div className="">
            <StickyBox
              offsetTop={65}
              offsetBottom={10}
              className="bg-white z-10"
            >
              <DateBox setShowDate={setShowDate} />
            </StickyBox>

            <div className="!z-0">
              <ShowtimeSection showDate={showDate} movieId={movie.id} />
            </div>
          </div>
          <StickyBox offsetTop={10} offsetBottom={10} className="">
            <div className="">
              <Review movieId={movie.id} />
            </div>
            <div className="mt-3">
              <CastCarousel castList={movie.castings} />
            </div>
            <div className="mt-5">
              <h1 className=" text-2xl font-bold">
                Bài viết
              </h1>
              <PostCards />
              <div className="text-center">
                <Link href="/bai-viet">
                  <Button className="w-32  cursor-pointer">Xem tất cả</Button>
                </Link>
              </div>
            </div>
          </StickyBox>
        </div>
        <StickyBox
          offsetTop={65}
          offsetBottom={10}
          className="md:w-1/3 hidden md:flex "
        >
          <div className=" w-full">
            <SidebarMovieList movieId={movie.id} />
          </div>
        </StickyBox>
      </div>
    </section>
  );
};

export default MoviePage;
