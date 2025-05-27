"use client";
import { useModal } from "../../hooks/useModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { toast } from "react-toastify";
import { DatePicker } from "../DatePicker";
import { DateTimeSelector } from "../DateTimeSelector";
import { useState } from "react";



const ShowtimeSchema = z.object({
  startTime: z.date({ required_error: "Vui lòng chọn thời gian bắt đầu" }),
  endTime: z.date({ required_error: "Vui lòng chọn thời gian kết thúc" }),
  showDate: z.date({ required_error: "Vui lòng chọn ngày chiếu" }),
});

type ShowtimeFormValues = z.infer<typeof ShowtimeSchema>;
const CreateShowtime = () => {
  const { openShowtime, setOpenShowtime, movieId } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ShowtimeFormValues>({
    resolver: zodResolver(ShowtimeSchema),
  });
  const { setValue } = form;

  const onSubmit = async (data: ShowtimeFormValues) => {
    console.log("Dữ liệu đã nhập:", data);

    const staticData = {
      brandId: "a701f8c1-0784-46af-a2e3-76d8b5c723f7",
      companyId: "a8fd509d-3131-4030-973b-20365351cfec",
      roomId: "c082d975-c2ab-4c50-9bfb-5e7bd0630f52",
      movieId,
      seatPrices: [
        {
          price: 150000,
          seatType: "FOUR_DX",
        },
      ],
    };

    const payload = {
      ...staticData,
      ...data,
    };
    try {
      setIsLoading(true);
      const response = await fetch("/api/showtime", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra khi tạo suất chiếu!");
        return;
      }

      toast.success("Tạo suất chiếu thành công!");
      toast.success("Vui lòng chọn vào ngày để hiển thị suất chiếu đã tạo");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={openShowtime} onOpenChange={() => setOpenShowtime(false)}>
        <DialogContent className="max-w-full w-full h-[80vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="p-4">
            <DialogTitle>Tạo suất chiếu</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full p-5">
            <p className="text-sm text-red-500 font-bold my-2">Trang web đang trong quá trình thử nghiệm</p>
            <p className="text-sm text-gray-500 my-2">
              Suất chiếu cần phải tạo bời người quản trị thương hiệu trong
              admin, vì thời gian có hạn và tiết kiệm dữ liệu, bạn có muốn tạo
              nhanh suất chiếu để thử nghiệm đặt vé!
            </p>
            <p className="text-sm text-blue-500 my-2">
              Lưu lý <span className="font-bold">thời gian bắt đầu</span>  và <span className="font-bold">thời gian kết thúc</span>  phải  <span className="font-bold">lớn hơn thời gian hiện tại</span>  để tránh xung đột. Ngày chiếu phải là ngày hôm nay hoặc trở về sau 10 ngày. Ngày chiếu và ngày của thời gian bắt đầu hoặc kết thúc phải giống nhau
            </p>
            <p className="text-sm text-orange-500 my-2">Hãy chỉ tạo 1 suất chiếu cho một ngày cụ thể hoặc suất chiếu phải khác thời gian nhau</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          onChange={(date) =>
                            setValue("startTime", date as Date)
                          }
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  Tạo suất chiếu
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateShowtime;
