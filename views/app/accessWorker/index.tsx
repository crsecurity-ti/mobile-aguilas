import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import AccessWorkerHeader from "./components/AccessWorkerHeader";
import AccessWorkerItem from "./components/AccessWorkerItem";
import AccessWorkerModal from "./components/AccessWorkerModal";
import SearchBar from "../../../components/SearchBar";
import useWorkerAccessList, {
  CustomWorkerAccessList,
} from "../../../hooks/useWorkerAccessList";

export interface ModalDataType {
  uuid: string;
  name: string;
  uuidRegister: string;
  currentStatus: string
  rut: string;
  type: "inBuilding" | "outBuilding";
}

const AccessWorkerPageView = () => {
  const { run } = useLocalSearchParams();
  const { workerAccessListData, workerAccessListDataLoading } =
    useWorkerAccessList();

  const [searchTerm, setSearchTerm] = useState((run as string) ?? "");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<ModalDataType>({
    uuid: "",
    name: "",
    uuidRegister: "",
    currentStatus: "",
    rut: "",
    type: "inBuilding",
  });

  const [foundWorkerList, setFoundWorkerList] = useState<
    CustomWorkerAccessList[]
  >([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== "") {
        setFoundWorkerList(
          (workerAccessListData ?? []).filter(
            (worker) =>
              worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.rut
                ?.toLowerCase()
                .replace(/\./g, "")
                .replace(/-/g, "")
                .includes(searchTerm.toLowerCase()),
          ),
        );
      } else {
        setFoundWorkerList(workerAccessListData ?? []);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, workerAccessListData]);

  if (workerAccessListDataLoading) {
    return <Text>loading...</Text>;
  }

  const workersOnTheBuilding = foundWorkerList.filter(
    (fwl) => fwl.accessControlWorker,
  );

  return (
    <View>
      <AccessWorkerModal
        modalData={modalData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View className="my-2">
        <SearchBar
          placeholder="Buscar por nombre o rut"
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <ScrollView>
        <AccessWorkerHeader
          workersOut={
            workersOnTheBuilding.filter(
              (x) => x.accessControlWorker?.status === "out",
            ).length
          }
          workersIn={
            workersOnTheBuilding.filter(
              (x) => x.accessControlWorker?.status === "start",
            ).length
          }
        />
        {workersOnTheBuilding.length > 0 ? (
          workersOnTheBuilding.map((fwl) => (
            <AccessWorkerItem
              key={fwl.uuid}
              onPressControlItem={() => {
                setModalVisible(true);
                setModalData({
                  uuid: fwl?.uuid ?? "",
                  name: fwl?.name ?? "",
                  rut: fwl?.rut ?? "",
                  uuidRegister: fwl.accessControlWorker?.uuid ?? "",
                  currentStatus: fwl.accessControlWorker?.status ?? "",
                  type: "inBuilding",
                });
              }}
              type={
                fwl.accessControlWorker?.status === "out"
                  ? "inOutBuilding"
                  : "inBuilding"
              }
              accessWorker={fwl}
            />
          ))
        ) : (
          <Text className="p-4 text-blue-800 text-center">
            {searchTerm !== ""
              ? "No se encontraron trabajadores en el recinto con esta búsqueda."
              : "No hay trabajadores en el recinto."}
          </Text>
        )}
        <Text className="p-4 pb-3 capitalize">Listado de trabajadores</Text>
        <ScrollView className="mb-10">
          {foundWorkerList.filter((fwl) => !fwl.accessControlWorker).length >
          0 ? (
            foundWorkerList
              .filter((fwl) => !fwl.accessControlWorker)
              .map((fwl) => (
                <AccessWorkerItem
                  key={fwl.uuid}
                  onPressControlItem={() => {
                    setModalVisible(true);
                    setModalData({
                      uuid: fwl?.uuid ?? "",
                      name: fwl?.name ?? "",
                      rut: fwl?.rut ?? "",
                      uuidRegister: fwl.accessControlWorker?.uuid ?? "",
                      currentStatus: fwl.accessControlWorker?.status ?? "",
                      type: "outBuilding",
                    });
                  }}
                  type="outBuilding"
                  accessWorker={fwl}
                />
              ))
          ) : (
            <Text className="p-4 text-blue-800 text-center">
              {searchTerm !== ""
                ? "No se encontraron trabajadores fuera del recinto con esta búsqueda."
                : "No quedan trabajadores inscritos, fuera del recinto."}
            </Text>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default AccessWorkerPageView;
