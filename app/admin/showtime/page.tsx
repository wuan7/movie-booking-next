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
import { DateTimeSelector } from "../../../components/DateTimeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { getCompanies } from "../../../actions/company";
import { getBrands } from "../../../actions/brand";
import { getMovies } from "../../../actions/movie";
import { getRooms } from "../../../actions/room";
import { DatePicker } from "../../../components/ui/date-picker";
import { Brand, Company, Movie, Room } from "../../../lib/generated/prisma";
import { Input } from "../../../components/ui/input";

const ShowtimeSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn rạp chiếu"),
  brandId: z.string().min(1, "Vui lòng chọn chi nhánh"),
  movieId: z.string().min(1, "Vui lòng chọn phim"),
  roomId: z.string().min(1, "Vui lòng chọn phòng chiếu"),
  startTime: z.date({ required_error: "Vui lòng chọn thời gian bắt đầu" }),
  endTime: z.date({ required_error: "Vui lòng chọn thời gian kết thúc" }),
  showDate: z.date({ required_error: "Vui lòng chọn ngày chiếu" }),
  seatPrices: z.array(
    z.object({
      seatType: z.string().min(1, "Vui lòng chọn loại ghế"),
      price: z.number().min(1, "Giá vé phải lớn hơn 0"),
    })
  ),
});

type ShowtimeFormValues = z.infer<typeof ShowtimeSchema>;

const ShowtimePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const availableSeatTypes = ["STANDARD", "FOUR_DX", "VIP", "COUPLE"]; // hoặc fetch động nếu cần
  const [, setSelectedSeatType] = useState("");
  const form = useForm<ShowtimeFormValues>({
    resolver: zodResolver(ShowtimeSchema),
    defaultValues: {
      companyId: "",
      brandId: "",
      movieId: "",
      roomId: "",
      startTime: new Date(),
      endTime: new Date(),
      showDate: new Date(),
      seatPrices: [],
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [companiesData, brandsData, moviesData, roomsData] =
          await Promise.all([
            getCompanies(),
            getBrands(),
            getMovies(),
            getRooms(),
          ]);
        setCompanies(companiesData);
        setBrands(brandsData);
        setMovies(moviesData);
        setRooms(roomsData);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ShowtimeFormValues) => {
    console.log("Dữ liệu đã nhập:", data);
    try {
      setIsLoading(true);
      const response = await fetch("/api/showtime", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra khi tạo suất chiếu!");
        return;
      }

      toast.success("Tạo suất chiếu thành công!");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thương hiệu</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi nhánh</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn chi nhánh" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng chiếu</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn phòng chiếu" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="movieId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phim</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn phim" />
                    </SelectTrigger>
                    <SelectContent>
                      {movies.map((movie) => (
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

          <FormField
            control={form.control}
            name="showDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày chiếu</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thời gian bắt đầu */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian bắt đầu</FormLabel>
                <FormControl>
                  <DateTimeSelector
                    value={field.value}
                    onChange={(date) => setValue("startTime", date as Date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thời gian kết thúc */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian kết thúc</FormLabel>
                <FormControl>
                  <DateTimeSelector
                    value={field.value}
                    onChange={(date) => setValue("endTime", date as Date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seatPrices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá vé theo loại ghế</FormLabel>

                {/* Select để thêm loại ghế */}
                <div className="flex gap-4 items-center">
                  <Select
                    onValueChange={(value) => {
                      setSelectedSeatType(value);
                      // Nếu seatType chưa tồn tại trong seatPrices thì thêm vào
                      if (
                        !field.value.find((item) => item.seatType === value)
                      ) {
                        field.onChange([
                          ...field.value,
                          { seatType: value, price: 0 },
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn loại ghế" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSeatTypes
                        .filter(
                          (type) =>
                            !field.value.some((item) => item.seatType === type)
                        )
                        .map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Render các ghế đã chọn */}
                <div className="space-y-4 mt-4">
                  {field.value.map((item, index) => (
                    <div
                      key={item.seatType}
                      className="flex items-center gap-4 border p-3 rounded-md"
                    >
                      <span className="w-24 capitalize">{item.seatType}</span>
                      <Input
                        type="number"
                        placeholder="Giá"
                        value={item.price}
                        onChange={(e) => {
                          const newPrice = Number(e.target.value);
                          const updatedSeatPrices = field.value.map((sp, i) =>
                            i === index ? { ...sp, price: newPrice } : sp
                          );
                          field.onChange(updatedSeatPrices);
                        }}
                      />
                      <span>VNĐ</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const updated = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(updated);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            Tạo suất chiếu
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ShowtimePage;
