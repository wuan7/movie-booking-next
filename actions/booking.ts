export const getHeldSeatsByShowtimeId = async (id: string) => {
  try {
    const response = await fetch(`/api/booking/held-seats?showtimeId=${id}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch held seats");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetch held seats:", error);
    throw error;
  }
};

export const getBookingByUserId = async () => {
  try {
    const response = await fetch(`/api/booking/user`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};