export const getRooms = async () => {
  try {
    const response = await fetch("/api/room", {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};


export const getRoomsByBrandId = async (brandId: string) => {
  try {
    const response = await fetch(`/api/room/brand/${brandId}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}
