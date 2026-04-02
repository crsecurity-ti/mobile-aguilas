import { Pressable, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

const DocumentListItem = ({
  setPdfData,
  checked,
  setChecked,
  index,
  item,
}: {
  setPdfData: ({ visible, uri }: { visible: boolean; uri: string }) => void;
  checked: { checked: boolean; signatureUuid: string }[];
  setChecked: (checked: { checked: boolean; signatureUuid: string }[]) => void;
  index: number;
  item: any;
}) => {
  if (!checked) return null;

  return (
    <View className="flex flex-row border-b border-gray-400 mx-4 py-4 items-center">
      <View className="bg-sky-700 mr-5 p-3 rounded-full justify-center items-center">
        <Ionicons name="document" color="white" size={19} />
      </View>

      <View className="flex-1">
        <Text className="font-semibold">{item.file.name}</Text>
        <View className="flex flex-row items-center mt-1">
          <Pressable
            onPress={() =>
              setPdfData({
                visible: true,
                uri:
                  `${process.env.EXPO_PUBLIC_API_URL}files/` +
                  item.file.url.replace("uploads/", ""),
              })
            }
          >
            <Text className="text-blue-800 font-semibold mr-2">
              Ver documento
            </Text>
          </Pressable>
          <Text className="text-sm">
            {formatDistance(item.createdAt, new Date(), { locale: es })}
          </Text>
        </View>
      </View>

      <View className="ml-4 justify-center items-center">
        <BouncyCheckbox
          size={25}
          fillColor="green"
          unFillColor="#FFFFFF"
          iconStyle={{ borderColor: "green" }}
          innerIconStyle={{ borderWidth: 2 }}
          textStyle={{ fontFamily: "JosefinSans-Regular" }}
          isChecked={checked[index]?.checked ?? false}
          onPress={(isChecked: boolean) => {
            const newChecked = [...checked];
            newChecked[index].checked = isChecked;
            setChecked(newChecked);
          }}
        />
      </View>
    </View>
  );
};

export default DocumentListItem;
