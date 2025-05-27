"use client";
import { getMovies } from '../../../../actions/movie';
import { Button } from '../../../../components/ui/button';
import { Movie } from '../../../../lib/generated/prisma';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Image from "next/image";
const ListPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    
 useEffect(() => {
     const fetchMovies = async () => {
       try {
         const data = await getMovies();
         setMovies(data);
         console.log("data", data);
       } catch (error) {
         console.log(error);
         toast.error("Có lỗi xảy ra!");
       }
     };
     fetchMovies();
   },[]);

   const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá phim này?")) return;
    try {
      const res = await fetch(`/api/movie/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Đã xoá phim");
       const data = await getMovies();
         setMovies(data);
      } else {
        toast.error("Xoá phim thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xoá phim");
      console.error(error);
    }
  };
  return (
    <div className="p-5">
  <h2 className="text-xl font-semibold mb-4">Tất cả phim</h2>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {movies.map((movie) => (
      <div key={movie.id} className="border rounded-lg p-3 space-y-2">
        <div className="relative w-full h-56">
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <h3 className="font-medium text-lg">{movie.title}</h3>
        <p className="text-sm line-clamp-2">{movie.description}</p>
        <Button
          variant="destructive"
          onClick={() => handleDelete(movie.id)}
          className="w-full"
        >
          Xoá
        </Button>
      </div>
    ))}
  </div>
</div>
  )
}

export default ListPage