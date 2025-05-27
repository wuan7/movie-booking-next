import HeroBanner from "../components/HeroBanner";
import MovieList from "../components/MovieList";
import PostCards from "../components/PostCards";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full mb-5">
      <HeroBanner />
      <div className="max-w-6xl mx-auto  ">
        <div className="mt-10">
          <div className="mb-5 text-center">
            <div className="text-2xl font-bold text-primary border border-primary inline-block rounded-md px-5 py-1">
              Phim đang chiếu
            </div>
          </div>
          <MovieList status="NOW_SHOWING" />
          <div className="text-center">
            <Link href="/phim">
              <Button className="w-32 mt-10 cursor-pointer">Xem tất cả</Button>
            </Link>
          </div>
          <div className="mb-5 mt-10 text-center">
            <div className="text-2xl font-bold text-primary border border-primary inline-block rounded-md px-5 py-1">
              Phim sắp chiếu
            </div>
          </div>
          <MovieList status="COMING_SOON" />
          <div className="text-center">
            <Link href="/phim">
              <Button className="w-32 mt-10 cursor-pointer">Xem tất cả</Button>
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5 text-center">
            <div className="text-2xl font-bold text-primary border border-primary inline-block rounded-md px-5 py-1">
              Bài viết
            </div>
          </div>
          <PostCards />
          <div className="text-center">
            <Link href="/bai-viet">
              <Button className="w-32  cursor-pointer">Xem tất cả</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
