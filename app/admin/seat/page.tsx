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
import { getRoomSeatsByBrandIdAndRoomId } from "../../../actions/seat";
import { Brand, Room, Row, Seat } from "../../../lib/generated/prisma";
import { getRowsByRoomId } from "../../../actions/row";
import { RoomWithRowAndSeats, RowWithSeats } from "../../../types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";
import Image from "next/image";
const SeatSchema = z.object({
  seatCode: z.string().min(1, "Mã ghế không được để trống"),
  rowName: z.string().min(1, "Tên hàng ghế không được để trống"),
  seatType: z.string().min(1, "Loại ghế không được để trống"),
  centerType: z.string().min(1, "Vị trí ghế không được để trống"),
  rowId: z.string().min(1, "hàng ghế không được để trống"),
});

type SeatFormValues = z.infer<typeof SeatSchema>;

const SeatPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [seats, setSeats] = useState<RoomWithRowAndSeats[]>([]);
  const [brandId, setBrandId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SeatFormValues>({
    resolver: zodResolver(SeatSchema),
    defaultValues: {
      seatCode: "",
      rowName: "",
      rowId: "",
      seatType: "",
      centerType: "NOMAL",
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

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setIsLoading(true);
        const data = await getRoomSeatsByBrandIdAndRoomId(brandId, roomId);
        console.log("seats", data);

        setSeats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (brandId && roomId) {
      fetchSeats();
    }
  }, [brandId, roomId]);

  const onSubmit = async (data: SeatFormValues) => {
    console.log("Dữ liệu đã nhập:", data);

    try {
      setIsLoading(true);
      const response = await fetch("/api/seat", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo ghế thành công!");
      if (brandId && roomId) {
        const updatedSeats = await getRoomSeatsByBrandIdAndRoomId(
          brandId,
          roomId
        );
        setSeats(updatedSeats);
      }
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

  const handleFetchRowsByRoomId = async () => {
    try {
      setIsLoading(true);
      const data = await getRowsByRoomId(roomId);
      setRows(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full  md:flex-row flex-col ">
      <div className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="seatCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã ghế</FormLabel>
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

            <FormField
              control={form.control}
              name="seatType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại ghế</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn loại ghế" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STANDARD">Tiêu chuẩn</SelectItem>
                        <SelectItem value="VIP">Vip</SelectItem>
                        <SelectItem value="FOUR_DX">4 DX </SelectItem>
                        <SelectItem value="COUPLE">Ghế đôi</SelectItem>
                        <SelectItem value="EMPTY">Ghế trống</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="centerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí ghế</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn vị trí ghế" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIRST_LEFT">FIRST_LEFT</SelectItem>
                        <SelectItem value="FIRST_RIGHT">FIRST_RIGHT</SelectItem>
                        <SelectItem value="FIRST_MIDDLE">
                          FIRST_MIDDLE
                        </SelectItem>
                        <SelectItem value="MIDDLE_LEFT">MIDDLE_LEFT</SelectItem>
                        <SelectItem value="MIDDLE_MIDDLE">
                          MIDDLE_MIDDLE
                        </SelectItem>
                        <SelectItem value="MIDDLE_RIGHT">
                          MIDDLE_RIGHT
                        </SelectItem>
                        <SelectItem value="LAST_LEFT">LAST_LEFT</SelectItem>
                        <SelectItem value="LAST_MIDDLE">LAST_MIDDLE</SelectItem>
                        <SelectItem value="LAST_RIGHT">LAST_RIGHT</SelectItem>
                        <SelectItem value="NOMAL">NOMAL</SelectItem>
                      </SelectContent>
                    </Select>
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
            {brandId && (
              <Button
                type="button"
                onClick={handleFetchRoomsByBrandId}
                className=""
              >
                Tìm phòng chiếu theo chi nhánh
              </Button>
            )}
            {rooms.length > 0 && (
              <FormItem>
                <FormLabel>Chi nhánh</FormLabel>
                <FormControl>
                  <Select
                    value={roomId}
                    onValueChange={(value) => setRoomId(value)}
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
            <br />
            {roomId && (
              <Button
                type="button"
                onClick={handleFetchRowsByRoomId}
                className=""
              >
                Tìm hàng ghế theo phòng chiếu
              </Button>
            )}

            {rows.length > 0 && (
              <FormField
                control={form.control}
                name="rowId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hàng ghế</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn hàng ghế" />
                        </SelectTrigger>
                        <SelectContent>
                          {rows.map((row: Row) => (
                            <SelectItem key={row.id} value={row.id}>
                              {row.rowName} ~ {row.rowNumber}
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

      <div className="p-5">
        <h1 className="text-lg font-semibold mb-4">Sơ đồ ghế</h1>

        <div className="overflow-hidden flex items-center justify-center border p-5 bg-gray-500 ">
          <div className="max-w-xs">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            centerOnInit
            limitToBounds={true}
            centerZoomedOut={true}
            panning={{ velocityDisabled: true }}
            doubleClick={{ disabled: true }}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              <div className="w-full flex justify-center mb-4">
                <Image
                  src="/img-screen.png"
                  alt="Curved Screen"
                  width={1200} // Giá trị gần đúng, tùy theo kích thước thực tế của ảnh
                  height={160} // Giữ tỉ lệ để không bị méo
                  sizes="100vw" // Responsive: chiếm 100% chiều ngang viewport
                  className="object-contain w-full h-auto" // Use `w-full` for full width and `h-auto` for proportional height
                />
              </div>

              <div className="flex flex-col ">
                {seats[0]?.rows.map((row: RowWithSeats) => (
                  <div key={row.id} className="flex  items-center">
                    <span className="w-6 text-sm font-medium">
                      {row.rowName}
                    </span>
                    {row.seats.map((seat: Seat) => (
                      <div
                        key={seat.id}
                        className={cn(
                          "p-1",
                          seat.centerType === "FIRST_LEFT" &&
                            "border-t-2 border-l-2 border-red-500 ",
                          seat.centerType === "FIRST_MIDDLE" &&
                            "border-t-2 border-red-500",
                          seat.centerType === "FIRST_RIGHT" &&
                            "border-t-2 border-r-2 border-red-500",
                          seat.centerType === "MIDDLE_LEFT" &&
                            "border-l-2 border-red-500",
                          seat.centerType === "MIDDLE_RIGHT" &&
                            "border-r-2 border-red-500",
                          seat.centerType === "LAST_LEFT" &&
                            "border-b-2 border-l-2 border-red-500",
                          seat.centerType === "LAST_MIDDLE" &&
                            "border-b-2 border-red-500",
                          seat.centerType === "LAST_RIGHT" &&
                            "border-b-2 border-r-2 border-red-500"
                        )}
                      >
                        <div
                          className={cn(
                            " h-10 bg-green-500 text-white flex items-center justify-center text-xs rounded hover:bg-green-600 cursor-pointer",
                            seat.seatType === "VIP" &&
                              "bg-red-500 hover:bg-red-500/80",
                            seat.seatType === "COUPLE"
                              ? "w-20 bg-pink-500 hover:bg-pink-500/80"
                              : "w-10 ",
                            seat.seatType === "EMPTY" &&
                              "bg-transparent hover:bg-transparent cursor-default text-transparent",
                            seat.seatType === "FOUR_DX" &&
                              "bg-blue-500 hover:bg-blue-500/80"
                          )}
                        >
                          {seat.seatCode}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </TransformComponent>
          </TransformWrapper>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatPage;
