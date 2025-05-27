export const getRoomSeatsByBrandIdAndRoomId = async (brandId: string, roomId: string) => {
  try {
    const response = await fetch(`/api/seat/room?brandId=${brandId}&roomId=${roomId}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch seats");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching seats:", error);
    throw error;
  }
}