"use client";
import { getBookingByUserId } from "../.././actions/booking";
import { BookingExpanded } from "../.././types";
import { CheckCircle, Loader, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns-tz";
const OrderPage = () => {
  const [orders, setOrders] = useState<BookingExpanded[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const orderData = await getBookingByUserId();
        console.log("order", orderData);
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, []);

  if (isLoading || orders === null) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-2">
        <Loader className="size-6 text-primary animate-spin" />
      </div>
    );
  }

  if (orders && orders.length === 0) {
    return (
      <div className="text-center h-[50vh] mt-10 text-gray-600 font-bold text-lg">
        Bạn chưa mua vé nào!
      </div>
    );
  }
  return (
    <div className="my-10 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Lịch sử đặt vé
      </h1>

      <div className="space-y-5">
        {orders.map((item) => (
          <Link
            key={item.id}
            href={`/phim/${item.showtime.movie.slug}`}
            className="block"
          >
            <div className="flex gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">
              <div className="relative w-24 h-32 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={item.showtime.movie.imageUrl}
                  alt={item.showtime.movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.showtime.movie.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tổng tiền:{" "}
                    <span className="text-gray-700 font-medium">
                      {item.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng vé:{" "}
                    <span className="text-gray-700">
                      {item.tickets.length} vé
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Thời gian chiếu:{" "}
                    <span className="text-gray-700">
                      {format(new Date(item.showtime.startTime), "HH:mm")} -{" "}
                      {format(new Date(item.showtime.endTime), "HH:mm")} -{" "}
                      {new Date(item.showtime.showDate).toLocaleString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </p>
                  <div className="text-sm text-gray-500 gap-x-2 flex">
                    Ghế:{" "}
                    {item.tickets.map((ticket) => (
                      <p key={ticket.id} className="text-gray-700 font-medium">
                        {ticket.showtimeSeat.seatCode}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    Ngày đặt:{" "}
                    <span className="text-gray-700">
                      {new Date(item.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {true ? (
                      <>
                        <CheckCircle className="text-green-500 w-4 h-4" />
                        <span className="text-green-600">Thành công</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500 w-4 h-4" />
                        <span className="text-red-600">Thất bại</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
