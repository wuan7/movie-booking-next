"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { toast } from "react-toastify";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { getGenres } from "../../../actions/genre";
import { Genre, Nation } from "../../../lib/generated/prisma";
import { Textarea } from "../../../components/ui/textarea";
import { DatePicker } from "../../../components/ui/date-picker";
import ImageUpload from "../../../components/ImageUpload";
import { handleUploadImage } from "../../../utils/uploadImage";
import { getNations } from "../../../actions/nation";
const MovieSchema = z.object({
  title: z.string().min(1, "Tên phim không được để trống"),
  description: z.string().min(1, "Mô tả  không được để trống"),
  director: z.string().min(1, "Thiếu đạo diễn"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  trailerUrl: z.string().url("URL trailer không hợp lệ"),
  status: z.string().min(1, "Thiếu trạng thái phim"),
  releaseDate: z.date({ required_error: "Vui lòng chọn ngày phát hành" }),
  duration: z.string().min(1, "Thiếu thời lượng phim"),
  ageRating: z.string().min(1, "Thiếu age rating phim"),
  nationId: z.string().min(1, "Thiếu quốc gia phim"),
  genres: z.array(z.string()).min(1, "Chọn ít nhất 1 thể loại"),
  casts: z
    .array(
      z.object({
        name: z.string().min(1, "Tên diễn viên là bắt buộc"),
        imageUrl: z.string().url("URL ảnh không hợp lệ"),
      })
    )
    .min(1, "Phải có ít nhất 1 diễn viên"),
});

type MovieFormValues = z.infer<typeof MovieSchema>;

const MoviePage = () => {
  const [genres, setBrands] = useState<Genre[]>([]);
  const [nations, setNations] = useState<Nation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(MovieSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      imageUrl: "",
      imagePublicId: "",
      trailerUrl: "",
      status: "",
      releaseDate: new Date(),
      duration: "",
      ageRating: "",
      nationId: "",
      genres: [],
      casts: [],
    },
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setBrands(data);
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

  const onSubmit = async (data: MovieFormValues) => {
    console.log("Dữ liệu đã nhập:", data);
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
      const response = await fetch("/api/movie", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo phim thành công!");
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phim</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="director"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đạo diễn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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

            <FormField
              control={form.control}
              name="trailerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL trailer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="casts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diễn viên</FormLabel>
                  <div className="space-y-4">
                    {field.value.map((cast, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 border p-3 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Tên diễn viên"
                            value={cast.name}
                            onChange={(e) => {
                              const newCasts = [...field.value];
                              newCasts[index].name = e.target.value;
                              field.onChange(newCasts);
                            }}
                          />
                          <Input
                            placeholder="Image URL"
                            value={cast.imageUrl}
                            onChange={(e) => {
                              const newCasts = [...field.value];
                              newCasts[index].imageUrl = e.target.value;
                              field.onChange(newCasts);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const newCasts = field.value.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newCasts);
                            }}
                          >
                            Xoá
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        field.onChange([
                          ...field.value,
                          { name: "", imageUrl: "" },
                        ])
                      }
                    >
                      + Thêm diễn viên
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thể loại</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <label key={genre.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={genre.id}
                          checked={field.value.includes(genre.id)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, genre.id]
                              : field.value.filter((id) => id !== genre.id);
                            field.onChange(newValue);
                          }}
                        />
                        {genre.name}
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOW_SHOWING">Đang chiếu</SelectItem>
                        <SelectItem value="COMING_SOON">Sắp chiếu</SelectItem>
                        <SelectItem value="STOPPED">Không chiếu</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuổi xem</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn tuổi trung bình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">Phổ biến</SelectItem>
                        <SelectItem value="C13">Trên 13</SelectItem>
                        <SelectItem value="C16">Trên 16</SelectItem>
                        <SelectItem value="C18">Trên 18</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày phát hành</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quốc gia</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        {nations?.map((nation) => (
                          <SelectItem key={nation.id} value={nation.id}>
                            {nation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={isLoading}
            >
              Tạo phim
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MoviePage;
