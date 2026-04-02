import React, { useRef, useState } from "react";
import { Modal, StyleSheet } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import { View } from "../../../components/Themed";
import { Text } from "react-native";
import ButtonDS from "../../../components/ButtonDS";
import { useUserStore } from '../../../store/auth';
import LoadingSpinner from "../../../components/LoadingSpinner";
import { updateSignatureFile } from "../../../api/firestore/signaturesApi";

const SignatureModal = ({
  modalVisible,
  setModalVisible,
  signaturesChecked,
}: {
  signaturesChecked: { checked: boolean; signatureUuid: string }[];
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}) => {
  const ref = useRef<SignatureViewRef>(null);

  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);

  const handleSignature = async (signature: string) => {
    for (let index = 0; index < signaturesChecked.length; index++) {
      const element = signaturesChecked[index];
      await updateSignatureFile({
        businessUuid: user?.userInformation?.businessUuid ?? "",
        signatureUuid: element.signatureUuid,
        signature,
      });
    }
    handleClear();
    setModalVisible(false);
    setLoading(false);
  };

  const handleClear = () => {
    ref.current?.clearSignature();
    setLoading(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    ref.current?.readSignature();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      {loading && (<LoadingSpinner />)}
      <View className="flex-1 bg-black h-full w-full">
        <View className="mx-10 my-10">
          <Text className="mb-auto font-bold text-xl mt-5 text-center color-sky-600">
            Tu firma aquí
          </Text>
          <View style={{ height: "60%", width: "90%" }} className="mx-5">
            <SignatureScreen
              ref={ref}
              penColor={"blue"}
              onOK={handleSignature}
              onClear={handleClear}
              descriptionText={"Firma del trabajador"}
              webStyle={style}
            />
          </View>
          <ButtonDS text={"Firmar Documentos"} onPress={handleConfirm} />
          <ButtonDS
            intent="outline"
            text={"Cancelar"}
            onPress={() => {
              handleClear();
              setModalVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SignatureModal;
