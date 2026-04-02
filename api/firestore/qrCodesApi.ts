import firestore from "@react-native-firebase/firestore";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { QRCodeData } from "../types";
import { TZDate } from "@date-fns/tz";

export const validateAndUpdateQrCode = async ({
  businessUuid,
  contractorUuid,
  currentLocation,
  userUuid,
  qrCodeUuid,
}: {
  businessUuid: string;
  contractorUuid: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  userUuid: string;
  qrCodeUuid: string;
}) => {
  const docRef = firestore()
    .collection("qr_codes")
    .doc(businessUuid)
    .collection(contractorUuid)
    .doc(qrCodeUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as QRCodeData;
    if (!data || !data.valid) {
      return {
        err: true,
        message: "Código QR No valido",
      };
    }

    if (data.type === "single-use" && data.usageCount >= 1) {
      return {
        err: true,
        message: "El código QR ya fue utilizado",
      };
    }

    if (data.rangeDate) {
      const [startDateStr, endDateStr] = data.rangeDate;

      const startDate = new Date(`${startDateStr}T00:00:00.000Z`);
      const endDate = new Date(`${endDateStr}T23:59:59.000Z`);

      const currentDate = new Date();

      if (isBefore(currentDate, startDate) || isAfter(currentDate, endDate)) {
        return {
          err: true,
          message: "Código QR esta fuera de fecha",
        };
      }
    }
    const newData = {
      ...data,
      usageCount: data.usageCount + 1,
    };

    await docRef.update(newData);

    const newUuid = uuidv4();

    const validationLog = {
      qrCodeUuid,
      name: data.name,
      businessUuid,
      contractorUuid,
      description: data.description,
      location: currentLocation,
      validatedAt: new Date().toISOString(),
      validatedBy: userUuid,
      uuid: newUuid,
    };

    const validationRef = firestore()
      .collection("qr_code_validations")
      .doc(businessUuid)
      .collection(contractorUuid)
      .doc(newUuid);

    await validationRef.set(validationLog);

    return {
      error: false,
      message: "El código QR es valido",
    };
  } else {
    return {
      err: true,
      message: "Código QR No valido",
    };
  }
};
