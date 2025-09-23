import { Client, ID, Query, TablesDB } from "react-native-appwrite";
import { APPWRITE_VARIABLES } from "../constants/appwrite";
import { CARD_IMAGES } from "../constants/images";

const client = new Client()
  .setEndpoint(APPWRITE_VARIABLES.MAIN_ENDPOINT)
  .setProject(APPWRITE_VARIABLES.PROJECT_ID!);

const database = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listRows({
      databaseId: APPWRITE_VARIABLES.DATABASE_ID,
      tableId: APPWRITE_VARIABLES.TABLE_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];

      await database.updateRow({
        databaseId: APPWRITE_VARIABLES.DATABASE_ID,
        tableId: APPWRITE_VARIABLES.TABLE_ID,
        rowId: existingMovie.$id,
        data: {
          count: existingMovie.count + 1,
        },
      });
    } else {
      await database.createRow({
        databaseId: APPWRITE_VARIABLES.DATABASE_ID,
        tableId: APPWRITE_VARIABLES.TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id,
          count: 1,
          title: movie.title,
          poster_url: `${CARD_IMAGES.API_IMAGE_PATH}${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listRows({
      databaseId: APPWRITE_VARIABLES.DATABASE_ID,
      tableId: APPWRITE_VARIABLES.TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
