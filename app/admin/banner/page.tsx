"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { toast } from "react-toastify";
import ImageUpload from "../../../components/ImageUpload";
import { handleUploadImage } from "../../../utils/uploadImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { getMovies } from "../../../actions/movie";
import { Movie } from "../../../lib/generated/prisma";
const BannerSchema = z.object({
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  movieId: z.string().min(1, "Vui lòng chọn phim"),
});

type BannerFormValues = z.infer<typeof BannerSchema>;
const CompanyPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      imageUrl: "",
      imagePublicId: "",
      movieId: "",
    },
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const onSubmit = async (data: BannerFormValues) => {
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh lên");
      return;
    }
    const uploadedImage = await handleUploadImage(files, setIsLoading);
    if (!uploadedImage) {
      toast.warning("Tải ảnh lên thất bại");
      return;
    }
    data.imageUrl = uploadedImage.url;
    data.imagePublicId = uploadedImage.publicId;
    try {
      setIsLoading(true);
      const response = await fetch("/api/banner", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo company thành công!");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="max-w-2xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="movieId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phim</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn phim" />
                      </SelectTrigger>
                      <SelectContent>
                        {movies.length > 0 &&
                          movies.map((movie: Movie) => (
                            <SelectItem key={movie.id} value={movie.id}>
                              {movie.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <ImageUpload
                  files={files}
                  setFiles={setFiles}
                  loading={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={isLoading}
            >
              Tạo banner
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompanyPage;
