export const getNations = async () => {
    try {
        const response = await fetch("/api/nation", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch nations");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching nations:", error);
        throw error;
    }
}