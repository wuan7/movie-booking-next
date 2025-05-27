export const getGenres = async () => {
    try {
        const response = await fetch("/api/genre", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch Genres");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching Genres:", error);
        throw error;
    }
}