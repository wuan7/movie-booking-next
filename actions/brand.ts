export const getBrands = async () => {
    try {
        const response = await fetch("/api/brand", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch brands");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
    }
}