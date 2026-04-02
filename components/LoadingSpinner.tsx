import { ActivityIndicator, Text, View } from "react-native";

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text = "Loading" }: LoadingSpinnerProps) => (
  <View className="flex justify-center w-full h-full bg-white">
    <View className="flex-col justify-center">
      <ActivityIndicator color="#0ea5e9" size="large" />
      <Text className="text-center pt-5 text-sky-500 text-xl font-semibold">
        {text}
      </Text>
    </View>
  </View>
);

export default LoadingSpinner;
