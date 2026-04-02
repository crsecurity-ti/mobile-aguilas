import { useRouter } from "expo-router";
import { View, Text } from "react-native";

import MainLayout from "../../components/MainLayout";
import { useUserStore } from "../../store/auth";

export default function Details() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  return (
    <>
      <MainLayout>
        <View>
          <Text>Details Screens</Text>
          <Text>{user?.displayName}</Text>
          <Text
            onPress={() => {
              router.navigate("/rounds");
            }}
          >
            GO TO List
          </Text>
          <Text>{user?.email}</Text>
          <Text
            onPress={() => {
              router.navigate("/map");
            }}
          >
            GO TO MAP
          </Text>
        </View>
      </MainLayout>
    </>
  );
}
