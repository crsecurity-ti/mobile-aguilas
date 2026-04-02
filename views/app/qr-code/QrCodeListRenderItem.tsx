import { formatToTimeZone } from "date-fns-timezone";
import { Text, View } from "react-native";
import { QRCodeValidationLog } from "../../../api/types";

const QrCodeListRenderItem = ({ item }: { item: QRCodeValidationLog }) => {
  return (
    <View className="border-b border-muted-800 py-5">
      <View className="flex-row justify-between">
        <View>
          <Text className="text-coolGray-800 font-bold">
            Nombre: {item.name}
          </Text>
          <Text className="text-coolGray-600">
            Descripción:{" "}
            {item?.description
              ?.replace(/(\r\n|\n|\r)/gm, " ")
              .substring(0, 100)}
            {item?.description && item?.description.length > 100 ? "..." : ""}
          </Text>
        </View>
        <View>
          <Text className="text-coolGray-600">
            {formatToTimeZone(new Date(item.validatedAt), "DD/MM/YYYY", {
              timeZone: "Chile/Continental",
            })}
          </Text>
          <Text className="text-coolGray-600 text-center">
            {formatToTimeZone(new Date(item.validatedAt), "HH:mm", {
              timeZone: "Chile/Continental",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QrCodeListRenderItem;
