import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import Toast from "react-native-toast-message";

import AlertDialogCustom from "../../../../components/AlertDialogCustom";
import ButtonDS from "../../../../components/ButtonDS";
import SearchBar from "../../../../components/SearchBar";
import useAccessControl from "../../../../hooks/useAccessControl";
import { useUserStore } from "../../../../store/auth";
import { AccessControl } from "../../../../types/access";
import AccessItemDS from "../components/AccessItemDS";
import { updateControlAccessInFirestore } from "../../../../api/firestore/controlAccessApi";

const AccessPersonalOutView = () => {
  const { run, uniqueInstance } = useLocalSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [currentAccessControl, setCurrentAccessControl] = useState<
    Partial<AccessControl>
  >({
    uuid: "1",
    name: "1",
    status: "in",
    contractorUuid: "1",
    guardUuid: "1",
    createdAt: 1,
  });
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const { accessControlList } = useAccessControl();

  const [foundAccessControlList, setFoundAccessControlList] = useState<
    AccessControl[]
  >([]);

  const onPressControlItem = (accessControl: Partial<AccessControl>) => {
    setCurrentAccessControl(accessControl);
    setIsOpenAlert(true);
  };

  const onPressDeleteControlItem = () => {
    updateControlAccessInFirestore({
      uuid: currentAccessControl.uuid ?? "",
      contractorUuid: user?.userInformation.contractorUuid ?? "",
      status: "out",
    });
    setSearchTerm("");
    Toast.show({
      type: "info",
      text1: "Salida con éxito",
      text2: "Se realizo la salida con éxito",
    });
  };

  useEffect(() => {
    if (run) {
      setSearchTerm(run as string);
    } else {
      setSearchTerm("");
    }
  }, [run, uniqueInstance]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== "") {
        setFoundAccessControlList(
          (accessControlList ?? []).filter(
            (accessControl) =>
              accessControl.name
                .toLowerCase()
                .includes((searchTerm as string).toLowerCase()) ||
              accessControl.rut
                ?.toLowerCase()
                .replace(/\./g, "")
                .replace(/-/g, "")
                .includes((searchTerm as string).toLowerCase()) ||
              accessControl.vehiclePlate
                ?.toLowerCase()
                .includes((searchTerm as string).toLowerCase())
          )
        );
      } else {
        setFoundAccessControlList(accessControlList ?? []);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, accessControlList]);

  if ((accessControlList ?? []).length === 0)
    return (
      <View className="m-4">
        <Text className="text-center font-bold text-lg">
          No hay ninguna persona ingresada dentro del establecimiento
        </Text>
        <ButtonDS
          onPress={() =>
            router.navigate({
              pathname: "/access",
            })
          }
          text="Volver"
        />
      </View>
    );

  return (
    <>
      <AlertDialogCustom
        isOpen={isOpenAlert}
        setIsOpen={setIsOpenAlert}
        onPressAction={onPressDeleteControlItem}
        title="¿Marcar Salida?"
        body="¿Estás seguro de marcar la salida de esta persona?"
        actionText="Marcar salida"
      />
      <View>
        <View className="my-2">
          <SearchBar
            placeholder="Buscar por nombre, rut o patente"
            onChangeText={(text) => setSearchTerm(text)}
            currentValue={searchTerm as string}
          />
        </View>
        <FlatList
          className="h-[85vh]"
          data={foundAccessControlList}
          renderItem={({ item }) => (
            <AccessItemDS
              onPress={() => onPressControlItem(item)}
              accessControl={item}
              key={item.uuid}
            />
          )}
          keyExtractor={(item) => item.uuid}
        />
      </View>
    </>
  );
};

export default AccessPersonalOutView;
