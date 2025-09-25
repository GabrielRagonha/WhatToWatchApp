import { icons } from "@/src/constants/icons";
import { CARD_IMAGES } from "@/src/constants/images";
import useFetch from "@/src/hooks/useFetch";
import { FetchMoviesDetails } from "@/src/services/api";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>

    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/D"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => FetchMoviesDetails(id as string));

  return (
    <View className="bg-primary flex-1">
      {loading ? (
        <ActivityIndicator
          size="large"
          color={"#0000FF"}
          className="mt-10 self-center"
        />
      ) : error ? (
        <Text>Erro: {error?.message}</Text>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 80,
            }}
          >
            <View>
              <Image
                className="w-full h-[550px]"
                resizeMode="cover"
                source={{
                  uri: `${CARD_IMAGES.API_IMAGE_PATH}${movie?.poster_path}`,
                }}
              />
            </View>

            <View className="flex-col items-start justify-center mt-5 px-5">
              <Text className="text-white font-bold text-xl">
                {movie?.title}
              </Text>

              <View className="flex-row items-center gap-x-1 mt-2">
                <Text className="text-light-200 text-sm">
                  {movie?.release_date?.split("-")[0]}
                </Text>

                <Text className="text-light-200 text-sm">
                  {movie?.runtime}m
                </Text>
              </View>

              <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                <Image source={icons.star} className="size-4" />

                <Text className="text-white font-bold text-sm">
                  {Math.round(movie?.vote_average ?? 0)}/10
                </Text>

                <Text className="text-light-200">
                  ({movie?.vote_count} Avaliações)
                </Text>
              </View>

              <MovieInfo label="Sinopse" value={movie?.overview} />

              <MovieInfo
                label="Gêneros"
                value={movie?.genres?.map((g) => g.name).join(" - ") || "N/D"}
              />

              <View className="flex flex-row gap-5 w-full">
                <MovieInfo
                  label="Orçamento"
                  value={`${
                    movie?.budget
                      ? `R$ ${(movie?.budget / 1_000_000).toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 1,
                          }
                        )} milhões`
                      : "N/D"
                  }`}
                />

                <MovieInfo
                  label="Lucro"
                  value={`${
                    movie?.revenue
                      ? `R$ ${(movie?.revenue / 1_000_000).toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 1,
                          }
                        )} milhões`
                      : "N/D"
                  }`}
                />
              </View>

              <MovieInfo
                label="Produtoras"
                value={
                  movie?.production_companies.map((c) => c.name).join(" - ") ||
                  "N/D"
                }
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
            onPress={router.back}
          >
            <Image
              source={icons.arrow}
              className="size-5 mr-1 mt-0.5 rotate-180"
              tintColor={"#fff"}
            />
            <Text className="text-white font-semibold text-base">Voltar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MovieDetails;
