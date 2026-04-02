import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const SearchBar = ({
  placeholder,
  onChangeText,
  currentValue,
}: {
  placeholder: string;
  onChangeText: (text: string) => void;
  currentValue: string;
}) => {
  return (
    <View className="mx-2">
      <View className="w-full self-center">
        <TextInput
          className="bg-white rounded-md py-3 px-3 text-lg border border-gray-400 placeholder:text-gray-400"
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={currentValue}
        />
      </View>
    </View>
  );
};

export default SearchBar;
