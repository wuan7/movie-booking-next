
export const getShowtimeWithMovieIdAndShowDate = async (movieId: string, showDate: string) => {
  try {
    const response = await fetch(`/api/showtime/movie?movieId=${movieId}&showDate=${showDate}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch showtime");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching showtime:", error);
    throw error;
  }
}

export const getShowtimeWithBrandId = async (movieId: string, showDate: Date, brandId: string) => {
  try {
    const response = await fetch(`/api/showtime/brand?movieId=${movieId}&showDate=${showDate}&brandId=${brandId}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch showtime");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching showtime:", error);
    throw error;
  }
}

export const getShowtimeById = async (id: string) => {
  try {
    const response = await fetch(`/api/showtime/${id}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch showtime");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching showtime:", error);
    throw error;
  }
}

export const updateSeatStatus = async (showtimeId: string, seatIds: string[], status: string) => {
  try {
    const response = await fetch(`/api/showtime/seat`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        showtimeId,
        seatIds,
        status,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update seat status");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating seat status:", error);
    throw error;
  }
};