import { logCatchErr } from "./utils/crashlytics";
import ky from "ky";

export const validatePersonBiometric = async ({
  imageUri,
  businessUuid,
  contractorUuid,
}: {
  imageUri: string;
  businessUuid: string;
  contractorUuid: string;
}) => {
  const formData = new FormData();

  const file = {
    uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
    type: "image/jpeg",
    name: "facial_image.jpg",
  } as any;

  formData.append("file", file);
  formData.append("businessUuid", businessUuid);
  formData.append("contractorUuid", contractorUuid);

  try {
    const response = await ky
      .post(`${process.env.EXPO_PUBLIC_API_URL}people/validate-biometric`, {
        body: formData,
        timeout: 100000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .json();

    return response;
  } catch (error: any) {
    logCatchErr(error);
    console.log(error.message);
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};
