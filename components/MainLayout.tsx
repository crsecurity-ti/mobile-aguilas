import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";

const MainLayout = ({
  children,
  returnButtonPath = "",
}: {
  children: React.ReactNode;
  returnButtonPath?: string;
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {returnButtonPath !== "" && (
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Pressable onPress={() => router.navigate(returnButtonPath)}>
                <Ionicons name="arrow-back" color="white" size={26} />
              </Pressable>
            ),
          }}
        />
      )}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MainLayout;
