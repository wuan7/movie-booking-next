export const getCompanies = async () => {
    try {
        const response = await fetch("/api/company", {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch Companies");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching Companies:", error);
        throw error;
    }
}