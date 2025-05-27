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
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { getBrands } from "../../../actions/brand";
import { Brand } from "../../../lib/generated/prisma";

const RoomSchema = z.object({
  name: z.string().min(1, "Tên category không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  brandId: z.string().min(1, "Vui lòng chọn chi nhánh"),
  totalSeats: z.string().min(1, "Vui lòng nhập số ghe"),
  roomType: z.string().min(1, "Vui lòng chọn loại phòng"),
});

type RoomFormValues = z.infer<typeof RoomSchema>;
const RoomPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: "",
      description: "",
      brandId: "",
      totalSeats: "",
      roomType: "TWO_D",
    },
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const onSubmit = async (data: RoomFormValues) => {
    console.log("Dữ liệu đã nhập:", data);

    try {
      setIsLoading(true);
      const response = await fetch("/api/room", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo phòng chiếu thành công!");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Phòng chiếu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tổng số ghế</FormLabel>
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

            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại phòng</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="TWO_D">2D</SelectItem>
                          <SelectItem value="THREE_D">3D</SelectItem>
                          <SelectItem value="IMAX">IMAX</SelectItem>
                          <SelectItem value="FOUR_DX">4DX</SelectItem>
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
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.length > 0 &&
                          brands.map((brand: Brand) => (
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


            <Button
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={isLoading}
            >
              Tạo Phòng Chiếu
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RoomPage;
