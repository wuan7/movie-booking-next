import { MovieExpanded } from "../types";
import { PlayCircle, Ticket } from "lucide-react";
import Image from "next/image";

interface MovieCardProps {
  movie: MovieExpanded;
}

export default function MovieCard({movie }: MovieCardProps) {
  console.log("genre:", movie.genres);
  return (
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
          <PlayCircle className="size-10 text-primary drop-shadow" />
          <button className="flex items-center gap-2 text-white px-4 py-2 cursor-pointer rounded-full font-semibold shadow-md transition-all duration-300 bg-gradient-to-b from-green-400 to-green-700 hover:from-green-300 hover:to-green-600">
            <Ticket className="w-5 h-5" />
            Mua vé ngay
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-3 px-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">{movie.ageRating}</span>
          <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs font-medium">Phụ đề</span>
          <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">2D</span>
        </div>
        <h2 className="text-primary font-semibold text-lg">{movie.title}</h2>
        <div className="flex flex-row items-center gap-1 text-sm text-muted-foreground">
          Thể loại:
          <p className="text-primary font-semibold">{movie.genres.map((genre) => genre.genre.name).join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
