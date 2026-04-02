import { formatToTimeZone } from "date-fns-timezone";
import { Text, View } from "react-native";

import { Event } from "../../../types";

const EventsListRenderItem = ({ item }: { item: Event | any }) => {
  return (
    <View className="border-b border-muted-800 py-5">
      <View className="flex-row justify-between">
        <View>
          <Text className="text-coolGray-800 font-bold">
            Categoría: {item.category}
          </Text>
          <Text className="text-coolGray-600">
            {item?.description
              ?.replace(/(\r\n|\n|\r)/gm, " ")
              .substring(0, 100)}
            {item?.description && item?.description.length > 100 ? "..." : ""}
          </Text>
        </View>
        <View>
          <Text className="text-coolGray-600">
            {item.phoneImages?.length} Foto
            {(item.phoneImages?.length || 0) > 1 ? "s" : ""}
          </Text>
          <Text className="text-coolGray-600">
            {formatToTimeZone(new Date(item.createdAt), "HH:mm", {
              timeZone: "Chile/Continental",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EventsListRenderItem;
