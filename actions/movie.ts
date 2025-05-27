export const getMoviesWithShowing = async (id?: string) => {
  try {
    if (id) {
      const response = await fetch(`/api/movie/now-showing?id=${id}`, {
        cache: "force-cache",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Movies");
      }
      return response.json();
    }
    const response = await fetch("/api/movie/now-showing", {
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Movies");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching Movies:", error);
    throw error;
  }
};

export const getMovies = async () => {
  try {
    const response = await fetch("/api/movie", {
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Movies");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching Movies:", error);
    throw error;
  }
};

export const getMovieById = async (id: string) => {
  try {
    const response = await fetch(`/api/movie/${id}`, {
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Movie");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching Movie:", error);
    throw error;
  }
};
export const getMovieWithStatus = async (status: string) => {
  try {
    const response = await fetch(`/api/movie/status?status=${status}`, {
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Movies");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching Movies:", error);
    throw error;
  }
}

export const getMoviesWithPagination = async (
  page: number,
  limit: number,
  status: string,
  genre: string,
  nation: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      nation,
      status,
      genre,
    });

    const response = await fetch(`/api/movie/pagination?${params.toString()}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
