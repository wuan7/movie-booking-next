"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ShowtimeExpanded } from "../../types";
import { cn } from "../../lib/utils";
import { CircleX, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { getShowtimeById, updateSeatStatus } from "../../actions/showtime";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { getHeldSeatsByShowtimeId } from "../../actions/booking";
import { pusherClient } from "../../lib/pusher";
type Row = {
  id: string;
  showtimeId: string;
  rowName: string;
  seats: {
    id: string;
    seatCode: string;
    seatType: string;
    centerType: string;
    rowId: string;
    status: string;
    seatNumber: string;
  }[];
};

type Seat = {
  id: string;
  seatCode: string;
  seatType: string;
  centerType: string;
  rowId: string;
  status: string;
  seatNumber: string;
};
const SeatMap = () => {
  const { openSeats, setOpenSeats, showtimeId } = useModal();
  const [showtime, setShowtime] = useState<ShowtimeExpanded | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [heldSeats, setHeldSeats] = useState<string[]>([]);
  const session = useSession();
 useEffect(() => {
    if (!showtimeId) return;
    (async () => {
      setIsLoading(true);
      const data = await getShowtimeById(showtimeId);
      setShowtime(data);
      const held = await getHeldSeatsByShowtimeId(showtimeId);
      setHeldSeats(held.heldSeatIds);
      setSelectedSeats([]);
      setIsLoading(false);
    })();
  }, [showtimeId]);
  useEffect(() => {
    // Xử lý xóa ghế khỏi selectedSeats nếu bị giữ bởi người khác
    const filteredSeats = selectedSeats.filter(
      (seat) => !heldSeats.includes(seat.id)
    );
    if (filteredSeats.length !== selectedSeats.length) {
      setSelectedSeats(filteredSeats);
    }
  }, [heldSeats, selectedSeats]);
useEffect(() => {
  if (!showtimeId) return;

   const wakeUpServer = async () => {
      try {
        await fetch(process.env.BACKEND_URL || "https://movie-booking-worker.onrender.com");
      } catch (err) {
        console.error("Lỗi wake-up server:", err);
      }
    };

    wakeUpServer();
}, [showtimeId]);
 useEffect(() => {
    if (!showtimeId) return;
    const channel = pusherClient.subscribe(`showtime-${showtimeId}`);
    channel.bind("seat-status-changed", (payload: { seatIds: string[]; status: string }) => {
      setHeldSeats(payload.status === 'HELD' ? payload.seatIds : state => {
        // for BOOKED, remove from held
        if (payload.status === 'BOOKED' || 'AVAILABLE') {
          return state.filter(id => !payload.seatIds.includes(id));
        }
       
        return state;
      });
      setShowtime(prev => prev && {
        ...prev,
        rows: prev.rows.map(row => ({
          ...row,
          seats: row.seats.map(seat => (
            payload.seatIds.includes(seat.id)
              ? { ...seat, status: payload.status }
              : seat
          )),
        })),
      });
      const fetchUpdateSeatStatus = async () => {
        await updateSeatStatus(showtimeId, payload.seatIds, payload.status);
      }
      fetchUpdateSeatStatus();
     
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [showtimeId]);

const handleSeatClick = (seat: Seat) => {
  if (
    seat.status === 'BOOKED' ||
    heldSeats.includes(seat.id) ||
    seat.seatType === 'EMPTY'
  ) {
    return;
  }

  const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.id === seat.id);

  if (isSelected) {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.filter((selectedSeat) => selectedSeat.id !== seat.id)
    );
  } else {
    // Giới hạn tối đa 5 ghế
    if (selectedSeats.length >= 5) {
      toast.warning("Chỉ được chọn tối đa 5 ghế.");
      return;
    }

    const rowOfSeat = showtime?.rows.find((row) => row.id === seat.rowId);
    if (!rowOfSeat) return;

    const isCreatingGap = (
      seatToSelect: Seat,
      allSeatsInRow: Seat[],
      currentSelectedSeats: Seat[]
    ) => {
      const validSeats = allSeatsInRow.filter(
        (s) =>
          s.seatType !== 'EMPTY' &&
          s.status !== 'BOOKED' &&
          !heldSeats.includes(s.id)
      );

      const selectedIds = [...currentSelectedSeats.map((s) => s.id), seatToSelect.id];

      const sortedSeats = validSeats.sort(
        (a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber)
      );

      for (let i = 1; i < sortedSeats.length - 1; i++) {
        const prevSelected = selectedIds.includes(sortedSeats[i - 1].id);
        const nextSelected = selectedIds.includes(sortedSeats[i + 1].id);
        const currentUnselected = !selectedIds.includes(sortedSeats[i].id);

        if (prevSelected && nextSelected && currentUnselected) {
          return true; // tạo ra khoảng trống
        }
      }

      return false;
    };

    if (isCreatingGap(seat, rowOfSeat.seats, selectedSeats)) {
      toast.warning('Không được để trống 1 ghế ở giữa hàng.');
      return;
    }

    setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
  }
};


  if (isLoading || showtime === null) {
    return (
      <Dialog open={openSeats} onOpenChange={setOpenSeats}>
        <DialogContent className="max-w-full w-full  p-0 overflow-y-auto custom-scrollbar ">
          <DialogHeader className="p-4">
            <DialogTitle>Sơ đồ ghế</DialogTitle>
          </DialogHeader>

          <div className=" flex items-center justify-center border h-[90vh] p-5 bg-gray-900 ">
            <div className="w-full flex items-center justify-center gap-x-2">
              <Loader className="animate-spin text-primary " />
              <p className="text-center font-bold text-primary">Đang tải...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!showtime) {
    return (
      <Dialog open={openSeats} onOpenChange={setOpenSeats}>
        <DialogContent className="max-w-full w-full h-[90vh] p-0 overflow-y-auto custom-scrollbar">
          <DialogHeader className="p-4">
            <DialogTitle>Sơ đồ ghế</DialogTitle>
          </DialogHeader>

          <p className="text-center font-bold text-primary">
            Không tìm thấy suất chiếu
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const totalPrice = selectedSeats.reduce((total, seat) => {
    const seatPriceObj = showtime.seatPrices.find(
      (price) => price.seatType === seat.seatType
    );
    return total + (seatPriceObj ? seatPriceObj.price : 0);
  }, 0);

  const handleBuyTicket = async () => {
    if(session?.status === "unauthenticated") return toast.warning("Vui lớng đăng nhập");
    if (selectedSeats.length === 0) return toast.warning("Vui lớng chọn ghế");
    const data = {
      showtimeId,
      seatIds: selectedSeats.map((seat) => seat.id),
      totalPrice,
      userId: session?.data?.user?.id,
    };
    try {
      setBuyLoading(true);
      toast.success("Tiến hành giữ ghế");
      const res = await fetch("/api/booking/hold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status === 409)
        return toast.warning(
          "Ghế bạn chọn đã có người giữ. vui lòng kiểm tra lại!"
        );
      if (!res.ok) {
        toast.error("Giữ ghế thất bại!");
        return;
      }

      const orderData = await res.json();

      const paymentData = {
        holdId: `${orderData.orderId}/${showtimeId}`,
        amount: totalPrice,
      };

      const response = await fetch("/api/vnpay/create-payment-url", {
        method: "POST",
        body: JSON.stringify(paymentData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      toast.success("Đang điều hướng qua trang thanh toán, xin vui lòng chờ");
      setSelectedSeats([]);

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setBuyLoading(false);
    }
  };
  return (
    <>
      <Dialog open={openSeats} onOpenChange={setOpenSeats}>
        <DialogContent className="max-w-full w-full h-[90vh] p-0 overflow-y-auto custom-scrollbar">
          <DialogHeader className="p-4">
            <DialogTitle>Sơ đồ ghế</DialogTitle>
          </DialogHeader>

          <div className=" flex items-center justify-center border p-5 bg-gray-900 ">
            <div className="max-w-xs h-[300px]">
              <TransformWrapper
                initialScale={0.5}
                minScale={0.3}
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
                    {showtime &&
                      showtime.rows.map((row: Row) => (
                        <div key={row.id} className="flex  items-center">
                          <span className="w-6 text-sm font-medium text-white">
                            {row.rowName}
                          </span>
                          {row.seats.map((seat) => (
                            <div
                              key={seat.id}
                              className={cn(
                                "p-1",
                                seat.centerType === "FIRST_LEFT" &&
                                  "border-t-2 border-l-2 border-red-500 rounded-tl-md",
                                seat.centerType === "FIRST_MIDDLE" &&
                                  "border-t-2 border-red-500",
                                seat.centerType === "FIRST_RIGHT" &&
                                  "border-t-2 border-r-2 border-red-500 rounded-tr-md",
                                seat.centerType === "MIDDLE_LEFT" &&
                                  "border-l-2 border-red-500",
                                seat.centerType === "MIDDLE_RIGHT" &&
                                  "border-r-2 border-red-500",
                                seat.centerType === "LAST_LEFT" &&
                                  "border-b-2 border-l-2 border-red-500 rounded-bl-md",
                                seat.centerType === "LAST_MIDDLE" &&
                                  "border-b-2 border-red-500",
                                seat.centerType === "LAST_RIGHT" &&
                                  "border-b-2 border-r-2 border-red-500 rounded-br-md"
                              )}
                            >
                              <div
                                className={cn(
                                  " h-10 bg-green-500 text-white flex items-center justify-center text-xs rounded hover:bg-green-600 cursor-pointer",
                                  seat.seatType === "VIP" &&
                                    "text-white bg-red-500 hover:bg-red-500/75",
                                  seat.status === "BOOKED" &&
                                    "!bg-gray-500 cursor-default",
                                  seat.seatType === "COUPLE"
                                    ? "w-20 bg-pink-500 hover:bg-pink-500/80"
                                    : "w-10 ",
                                  seat.seatType === "EMPTY" &&
                                    "!bg-transparent !hover:bg-transparent cursor-default text-transparent",
                                  seat.seatType === "STANDARD" &&
                                    "text-white bg-purple-500 hover:bg-purple-500/75",
                                  seat.seatType === "FOUR_DX" &&
                                    "bg-blue-500 hover:bg-blue-500/80",
                                  selectedSeats.some(
                                    (s) => s.seatCode === seat.seatCode
                                  ) && "bg-yellow-500 hover:bg-yellow-500",
                                  heldSeats.includes(seat.id) &&
                                    "bg-orange-500 hover:bg-orange-500 cursor-not-allowed"
                                )}
                                onClick={() => handleSeatClick(seat)}
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
          <div className="w-full h-full p-5 ">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-gray-500" />
                <p className="text-sm font-medium ">Đã đặt</p>
              </div>

              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-yellow-500" />
                <p className="text-sm font-medium ">Ghế bạn chọn</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-orange-500" />
                <p className="text-sm font-medium ">Ghế đang bị giữ</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-purple-500" />
                <p className="text-sm font-medium ">Ghế thường</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-red-500" />
                <p className="text-sm font-medium ">Ghế VIP</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-pink-500" />
                <p className="text-sm font-medium ">Ghế đôi</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-blue-500" />
                <p className="text-sm font-medium ">Ghế 4DX</p>
              </div>

              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm border border-red-500" />
                <p className="text-sm font-medium ">Vùng trung tâm</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="border-b py-2">
              <div className="flex items-center gap-x-1">
                <div>
                  <span
                    className={cn(
                      " text-white px-2 py-0.5 rounded-full text-xs font-medium",
                      showtime.movie.ageRating === "C13" && "bg-yellow-600",
                      showtime.movie.ageRating === "P" && "bg-green-600",
                      showtime.movie.ageRating === "C16" && "bg-blue-600",
                      showtime.movie.ageRating === "C18" && "bg-red-600"
                    )}
                  >
                    {showtime.movie.ageRating === "C13" && "13+"}
                    {showtime.movie.ageRating === "P" && "P"}
                    {showtime.movie.ageRating === "C16" && "16+"}
                    {showtime.movie.ageRating === "C18" && "18+"}
                  </span>
                </div>
                <h1 className="font-semibold">{showtime.movie.title}</h1>
              </div>
              <p className="text-sm text-primary font-bold mt-1">
                {format(new Date(showtime.startTime), "HH:mm")} ~{" "}
                {format(new Date(showtime.endTime), "HH:mm")} ·{" "}
                {new Date(showtime.showDate).toLocaleDateString("vi")} ·{" "}
                {showtime.room.name} · {showtime.room.roomType} Phụ đề
              </p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p className="text-muted-foreground text-sm">Chỗ ngồi</p>
              {selectedSeats.length > 0 && (
                <div className="p-1 border rounded-sm flex items-center">
                  <div className="flex gap-x-1">
                    {selectedSeats.map((seat) => (
                      <p key={seat.id} className="text-sm">
                        {seat.seatCode}
                      </p>
                    ))}
                  </div>{" "}
                  <CircleX
                    onClick={() => setSelectedSeats([])}
                    className="size-4 cursor-pointer ml-1 text-red-500"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center p-5">
            <div>
              <p className="text-muted-foreground text-sm">Tạm tính</p>
              <p className="font-bold ">
                {totalPrice.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <Button
              disabled={selectedSeats.length === 0 || buyLoading}
              className="cursor-pointer"
              onClick={handleBuyTicket}
            >
              Mua vé
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeatMap;
