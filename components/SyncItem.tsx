import { format } from "date-fns";
import { Image, Text, View } from "react-native";

const SyncItem = ({
  item,
}: {
  item: {
    currentImage: string;
    eventUuid: string;
    createdAt: Date;
  };
}) => {
  return (
    <View className="border-b border-gray-500 p-2">
      <View className="justify-between flex-row">
        <Image
          style={{
            height: 48,
            width: 48,
            borderRadius: 40,
          }}
          alt="entrance"
          source={{
            uri: item.currentImage,
          }}
        />
        <View className="pl-2">
          <Text className="text-sm text-gray-800 font-semibold">
            {format(item.createdAt, "yyyy-MM-dd HH:mm")}
          </Text>
          <Text className="font-bold text-gray-800">{item.eventUuid}</Text>
          <Text className="text-gray-600">{item.currentImage}</Text>
        </View>
      </View>
    </View>
  );
};

export default SyncItem;
