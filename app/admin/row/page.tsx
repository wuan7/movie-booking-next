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

import { getBrands } from "../../../actions/brand";
import { getRoomsByBrandId } from "../../../actions/room";
import { Brand, Room } from "../../../lib/generated/prisma";

const RowSchema = z.object({
  rowNumber: z.string().min(1, "Số hàng không được để trống"),
  rowName: z.string().min(1, "Tên hàng không được để trống"),
  roomId: z.string().min(1, "Phòng chiếu không được để trống"),
});

type RowFormValues = z.infer<typeof RowSchema>;
const RowPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RowFormValues>({
    resolver: zodResolver(RowSchema),
    defaultValues: {
      rowNumber: "",
      rowName: "",
      roomId: "",
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

  const onSubmit = async (data: RowFormValues) => {
    console.log("Dữ liệu đã nhập:", data);

    try {
      setIsLoading(true);
      const response = await fetch("/api/row", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo hàng ghế thành công!");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFetchRoomsByBrandId = async () => {
    try {
      setIsLoading(true);
      const data = await getRoomsByBrandId(brandId);
      setRooms(data);
    } catch (error) {
      console.error(error);
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
              name="rowNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số hàng ghế</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rowName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hàng ghế</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
                  <FormLabel>Chi nhánh</FormLabel>
                  <FormControl>
                    <Select
                      value={brandId}
                      onValueChange={(value) => setBrandId(value)}
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

            <Button type="button" onClick={handleFetchRoomsByBrandId} className="">
              Tìm phòng chiếu theo chi nhánh
            </Button>
            {rooms.length > 0 && (
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi nhánh</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn phòng chiếu" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((room: Room) => (
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
            )}

            <Button
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={isLoading}
            >
              Tạo hàng ghế
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RowPage;
