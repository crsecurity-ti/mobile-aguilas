import { Text, View } from "react-native";

interface NoRoundsProps {
  title?: string;
  description?: string;
}

const NoRounds = ({
  title = "No tienes rondas asignadas para el dia de hoy",
  description = "Consulte con su supervisor si no encuentra una ronda asignada.",
}: NoRoundsProps) => {
  return (
    <View className="mx-5 mt-10">
      <Text className="text-center text-sky-800 text-2xl font-bold">
        {title}
      </Text>
      <Text className="mt-10 font-semibold text-center text-lg">
        {description}
      </Text>
    </View>
  );
};

export default NoRounds;
