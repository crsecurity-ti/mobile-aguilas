import { Modal, Text, Pressable, View } from "react-native";

const AlertDialogCustom = ({
  isOpen,
  setIsOpen,
  onPressAction,
  title,
  body,
  actionText,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onPressAction: () => void;
  title: string;
  body: string;
  actionText: string;
}) => {
  const onClose = () => setIsOpen(false);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <View className="p-5 m-10 bg-gray-100 justify-center border border-gray-600 rounded-xl">
          <Text className="font-bold text-2xl">{title}</Text>
          <Text className="font-semibold my-4">{body}</Text>
          <View className="flex-row justify-end w-full">
            <Pressable className="justify-center mr-5" onPress={onClose}>
              <Text className="text-sky-800 font-semibold">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onClose();
                onPressAction();
              }}
            >
              <Text className="text-red-600 font-bold">{actionText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertDialogCustom;
