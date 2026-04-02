import "react-native-get-random-values";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { v4 as uuidv4 } from "uuid";

import NFCButton from "./NFCButton";
import { RoundSupervisor } from "./types";

const ButtonValidateVisit = ({
  roundSupervisor,
}: {
  roundSupervisor: RoundSupervisor;
}) => {
  const router = useRouter();

  return (
    <>
      <Pressable
        className="mx-3 mt-2 border border-gray-300 p-4 flex-row flex justify-center rounded-lg"
        onPress={() => {
          router.navigate({
            pathname: "/camera-supervisor",
            params: {
              roundUuid: roundSupervisor.uuid,
              uniqueInstance: uuidv4(),
              locationsData: roundSupervisor.locations.map((l) => ({
                qrCode: l.qrCode,
                lat: l.contractor.lat,
                lng: l.contractor.lng,
              } as any)),
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
      <NFCButton roundUuid={roundSupervisor.uuid} />
    </>
  );
};

export default ButtonValidateVisit;
