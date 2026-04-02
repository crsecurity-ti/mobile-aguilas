import { Pressable, Text, View } from "react-native";

const AccessWorkerModalButton = ({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View className="p-2 border-gray-300 border rounded-lg">
        <Text className="text-lg font-bold text-blueGray-900 capitalize">
          {title}
        </Text>
        <Text className="text-sm text-blue-600 font-semibold">
          {description}
        </Text>
      </View>
    </Pressable>
  );
};

export default AccessWorkerModalButton;
