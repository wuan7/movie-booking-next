
export const getReviewsByMovieId = async (id: string) => {
  try {
    const response = await fetch(`/api/review/${id}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}