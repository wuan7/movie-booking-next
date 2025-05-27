export const getRowsByRoomId = async (roomId: string) => {
  try {
    const response = await fetch(`/api/row/room/${roomId}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch rows");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching rows:", error);
    throw error;
  }
}