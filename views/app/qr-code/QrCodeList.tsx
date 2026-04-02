import "react-native-get-random-values";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { logCatchErr } from "../../../api/utils/crashlytics";
import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useUserStore } from "../../../store/auth";
import NoQRCodes from "./NoQRCodes";
import { FlatList } from "react-native-gesture-handler";
import QrCodeListRenderItem from "./QrCodeListRenderItem";
import { QRCodeValidationLog } from "../../../api/types";

const QrCodeList = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [qrCodeValidations, setQrCodeValidations] = useState<
    QRCodeValidationLog[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uuid || !user?.userInformation?.businessUuid) return;

    const businessUuid = user.userInformation.businessUuid;
    let unsubscribes: (() => void)[] = [];

    const fetchData = async () => {
      try {
        setLoading(true);
        let allQrCodeValidations = new Map<string, QRCodeValidationLog>();

        if (
          user.userInformation.role === "supervisor" &&
          user.userInformation.contractors
        ) {
          const contractorUuids: string[] = user.userInformation.contractors;

          contractorUuids.forEach((contractorUuid) => {
            const unsubscribe = firestore()
              .collection("qr_code_validations")
              .doc(businessUuid)
              .collection(contractorUuid)
              .where("validatedBy", "==", user.uuid)
              .onSnapshot(
                (querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const data = doc.data() as QRCodeValidationLog;
                    allQrCodeValidations.set(data.uuid, data);
                  });

                  setQrCodeValidations(
                    Array.from(allQrCodeValidations.values())
                  );
                },
                (error) => {
                  logCatchErr(error);
                }
              );

            unsubscribes.push(unsubscribe);
          });
        } else {
          const contractorUuid = user?.userInformation?.contractorUuid ?? "a";
          const unsubscribe = firestore()
            .collection("qr_code_validations")
            .doc(businessUuid)
            .collection(contractorUuid)
            .where("validatedBy", "==", user.uuid)
            .onSnapshot(
              (querySnapshot) => {
                let qrCodeValidationMap = new Map<
                  string,
                  QRCodeValidationLog
                >();

                querySnapshot.forEach((doc) => {
                  const data = doc.data() as QRCodeValidationLog;
                  qrCodeValidationMap.set(data.uuid, data);
                });

                setQrCodeValidations(
                  Array.from(qrCodeValidationMap.values()).sort(
                    (a, b) => Number(b.validatedAt) - Number(a.validatedAt)
                  )
                );
              },
              (error) => {
                logCatchErr(error);
              }
            );

          unsubscribes.push(unsubscribe);
        }
      } catch (error) {
        logCatchErr(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <View className="mx-5">
      <ButtonDS
        onPress={() =>
          router.navigate({
            pathname: "/validate-qr-code",
          })
        }
        text="Validar Código QR"
      />
      <Text className="text-center my-10">
        <Text className="text-sky-600 text-2xl font-bold">
          Últimos códigos validados
        </Text>
      </Text>
      {qrCodeValidations.length === 0 ? (
        <NoQRCodes />
      ) : (
        <FlatList
          data={qrCodeValidations
            .sort(
              (objA, objB) =>
                new Date(objB.validatedAt).getTime() -
                new Date(objA.validatedAt).getTime()
            )
            .slice(0, 5)}
          renderItem={({ item }) => <QrCodeListRenderItem item={item as any} />}
          keyExtractor={(item) => item.uuid}
        />
      )}
    </View>
  );
};

export default QrCodeList;
