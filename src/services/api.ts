import { TMDB_CONFIG } from "../constants/tmdb";

export const FetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${
        TMDB_CONFIG.BASE_URL
      }search/movie?language=pt-BR&query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}discover/movie?sort_by=popularity.desc&language=pt-BR`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Falha ao buscar filmes", response.statusText);
  }

  const data = await response.json();

  return data.results;
};

export const FetchMoviesDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?language=pt-BR&api_key=${TMDB_CONFIG.API_KEY}`,
      { method: "GET", headers: TMDB_CONFIG.headers }
    );

    if (!response.ok) {
      // @ts-ignore
      throw new Error("Falha ao buscar detalhes do filme");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
