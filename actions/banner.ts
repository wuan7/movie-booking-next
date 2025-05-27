export const getBanners = async () => {
    try {
        const response = await fetch("/api/banner", {
            cache: "force-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch banners");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    }
}