import "react-native-get-random-values";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import ButtonDS from "../../../components/ButtonDS";
import ButtonImage from "../../../components/ButtonImage";
import useAccessControl from "../../../hooks/useAccessControl";

const AccessPageView = () => {
  const { accessControlList } = useAccessControl();

  return (
    <View>
      <View className="justify-center align-center">
        <View className="my-4 justify-center items-center">
          <Image
            style={{ width: 50, height: 50 }}
            alt="entrance"
            source={require("../../../assets/images/favicon_.png")}
          />
        </View>
      </View>
      <View className="justify-center align-center flex-row pb-3 mb-4 border-b border-gray-400">
        <View className="mx-5">
          <Text className="text-center font-bold text-2xl text-blue-800">
            En el Establecimiento
          </Text>
          <Text className="text-center text-2xl font-semibold my-2">
            {accessControlList?.length ?? 0}
          </Text>
        </View>
      </View>
      <Text className="text-center font-semibold text-blue-800 text-lg my-3">
        Con Scanner
      </Text>
      <View className="justify-center align-center flex-row mb-3 pb-10 border-b border-gray-400">
        <ButtonImage
          onPress={() => {
            router.navigate({
              pathname: "access-personal-scanner",
              params: {
                status: "in",
                uniqueInstance: uuidv4(),
              },
            });
          }}
          imageSource={require("../../../assets/images/group.png")}
          text="Ingresar"
        />
        <ButtonImage
          onPress={() => {
            router.navigate({
              pathname: "access-personal-scanner",
              params: {
                status: "out",
                uniqueInstance: uuidv4(),
              },
            });
          }}
          disabled={accessControlList?.length === 0}
          imageSource={
            accessControlList?.length === 0
              ? require("../../../assets/images/group-out-disabled.png")
              : require("../../../assets/images/group-out.png")
          }
          text="Salida"
        />
      </View>
      <Text className="text-center font-semibold text-blue-800 text-lg my-3">
        Manualmente
      </Text>
      <View className="justify-center align-center flex-row mb-2 pb-10 border-b border-gray-400">
        <ButtonImage
          onPress={() => {
            router.navigate({
              pathname: "access-manual",
              params: {
                uuid: uuidv4(),
              },
            });
          }}
          imageSource={require("../../../assets/images/group.png")}
          text="Ingresar"
        />
        <ButtonImage
          onPress={() => {
            router.navigate({
              pathname: "access-personal-out",
              params: {
                uniqueInstance: uuidv4(),
                run: "",
              },
            });
          }}
          disabled={accessControlList?.length === 0}
          imageSource={
            accessControlList?.length === 0
              ? require("../../../assets/images/group-out-disabled.png")
              : require("../../../assets/images/group-out.png")
          }
          text="Salida"
        />
      </View>
      <View className="mt-3 mx-10">
        <ButtonDS
          text="Ir al Historial"
          onPress={() => {
            router.navigate({
              pathname: "/access-historial",
            });
          }}
        />
      </View>
    </View>
  );
};

export default AccessPageView;
