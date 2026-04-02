import { logCatchErr } from "./utils/crashlytics";
import ky from "ky";

export const loginWithFacial = async ({ imageUri }: { imageUri: string }) => {
  const formData = new FormData();
  
  const file = {
    uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
    type: "image/jpeg",
    name: "facial_image.jpg",
  } as any;

  formData.append("file", file);

  try {
    const response = await ky
      .post(`${process.env.EXPO_PUBLIC_API_URL}account/login/facial`, {
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
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};
