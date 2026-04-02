import "react-native-get-random-values";
import { StyleSheet, Modal, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";

import AccessWorkerModalButton from "./AccessWorkerModalButton";
import { useUserStore } from "../../../../store/auth";
import {
  createControlAccessWorkerInFirestore,
  deleteControlAccessWorkerInFirestore,
  updateControlAccessWorkerInFirestore,
} from "../../../../api/firestore/controlAccessWorkerApi";
import { createControlAccessWorkerHistoryInFirestore } from "../../../../api/firestore/controlAccessWorkerHistoryApi";

const AccessWorkerModal = ({
  modalVisible,
  setModalVisible,
  modalData,
}: {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  modalData: {
    uuid: string;
    uuidRegister?: string;
    currentStatus: string;
    name: string;
    rut: string;
    type: "inBuilding" | "outBuilding";
  };
}) => {
  const user = useUserStore((state) => state.user);

  const onPressButton = ({
    status,
  }: {
    status: "start" | "end" | "in" | "out";
  }) => {
    let uuid = uuidv4();
    createControlAccessWorkerHistoryInFirestore({
      uuid,
      workerUuid: modalData.uuid,
      contractorUuid: user?.userInformation.contractorUuid ?? "",
      status,
      workerData: modalData,
    });

    if (status === "start") {
      Toast.show({
        type: "success",
        text1: "Trabajador inicio su turno",
        text2: "Felicitaciones, el trabajador inicio su turno",
      });
      createControlAccessWorkerInFirestore({
        uuid,
        workerUuid: modalData.uuid,
        contractorUuid: user?.userInformation.contractorUuid ?? "",
        status,
      });
      setModalVisible(!modalVisible);
      return;
    }

    if (status === "in" || status === "out") {
      Toast.show({
        type: "info",
        text1: status === "in" ? "Trabajador ingreso" : "Trabajador salio",
        text2:
          status === "in"
            ? "Felicitaciones, el trabajador ingreso al establecimiento"
            : "Felicitaciones, el trabajador salio del establecimiento",
      });
      uuid = modalData.uuidRegister ?? "";
      updateControlAccessWorkerInFirestore({
        uuid,
        workerUuid: modalData.uuid,
        contractorUuid: user?.userInformation.contractorUuid ?? "",
        status,
      });
      setModalVisible(!modalVisible);
      return;
    }

    deleteControlAccessWorkerInFirestore({
      uuid: modalData.uuidRegister ?? "",
      contractorUuid: user?.userInformation.contractorUuid ?? "",
    });
    Toast.show({
      type: "info",
      text1: "Trabajador finalizo su turno",
      text2: "Felicitaciones, el trabajador finalizo su turno",
    });
    setModalVisible(!modalVisible);
  };
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View className="rounded-xl bg-white w-5/6" style={styles.modalView}>
          <Text className="text-center text-lg font-bold text-blueGray-700">
            {modalData.name}
          </Text>
          <Text className="text-center text-lg font-bold text-blueGray-700 mb-5">
            {modalData.rut}
          </Text>
          {modalData.type !== "inBuilding" ? (
            <View className="pb-2">
              <AccessWorkerModalButton
                title="Marcar inicio de turno"
                description="Esta acción inicia el turno del trabajador, marcando la entrada inicial al establecimiento."
                onPress={() => onPressButton({ status: "start" })}
              />
            </View>
          ) : (
            <>
              {!["start", "in"].includes(modalData.currentStatus) && (
                <View className="pb-2">
                  <AccessWorkerModalButton
                    title="Marcar ingreso"
                    description="Esta acción marca un ingreso al establecimiento del usuario."
                    onPress={() => onPressButton({ status: "in" })}
                  />
                </View>
              )}
              {modalData.currentStatus !== "out" && (
                <View className="pb-2">
                  <AccessWorkerModalButton
                    title="Marcar salida"
                    description="Esta acción marca un ingreso al establecimiento del usuario."
                    onPress={() => onPressButton({ status: "out" })}
                  />
                </View>
              )}

              <View>
                <AccessWorkerModalButton
                  title="Marcar fin de turno"
                  description="Esta acción finaliza el turno del trabajador, marcando la salida final del establecimiento."
                  onPress={() => onPressButton({ status: "end" })}
                />
              </View>
            </>
          )}
          <Pressable
            className="my-5 bg-gray-600 rounded-full"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text className="text-center p-2 text-white">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AccessWorkerModal;
