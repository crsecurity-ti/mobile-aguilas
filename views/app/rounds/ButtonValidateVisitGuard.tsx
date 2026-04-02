import "react-native-get-random-values";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import NFCButton from "./NFCButtonGuard";

const ButtonValidateVisitGuard = ({
  uuid,
  roundUuid,
  roundListDataUuid,
  roundData,
  roundsListData,
}: {
  uuid: string;
  roundUuid: string;
  roundListDataUuid: string | undefined;
  roundData: any;
  roundsListData: any;
}) => {
  const router = useRouter();

  return (
    <View className="flex-col justify-center">
      <Pressable
        className="mx-3 mt-2 border border-gray-300 p-4 flex-row flex justify-center rounded-lg"
        onPress={() => {
          router.navigate({
            pathname: "/camera",
            params: {
              uuid,
              roundUuid,
              roundListDataUuid: roundListDataUuid as string,
              uniqueInstance: uuidv4(),
              locationsData: roundData.locations.map(
                (l: { qrCode: string; lat: number; lng: number }) => ({
                  qrCode: l.qrCode,
                  lat: l.lat,
                  lng: l.lng,
                })
              ),
            },
          });
        }}
      >
        <Ionicons
          className="pr-2"
          name="camera-reverse"
          color="#0284c7"
          size={18}
        />
        <Text className="text-center text-sky-600 font-semibold">
          Validar Visita con QR
        </Text>
      </Pressable>
      <NFCButton
        roundData={roundData}
        uuid={uuid}
        roundListDataUuid={roundListDataUuid as string}
        roundsListData={roundsListData}
      />
    </View>
  );
};

export default ButtonValidateVisitGuard;
