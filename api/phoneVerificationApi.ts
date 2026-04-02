import auth from "@react-native-firebase/auth";
import { logCatchErr } from "./utils/crashlytics";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getToken = async (): Promise<string | null> => {
  const currentUser = auth().currentUser;
  if (!currentUser) return null;
  return await currentUser.getIdToken();
};

export interface OtpResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
}

export interface PhoneStatusResponse {
  phoneNumber?: string;
  phoneVerified: boolean;
}

export const sendOtp = async (
  phoneNumber: string
): Promise<OtpResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "No hay sesion activa" };
    }

    const url = `${API_URL}account/phone/send-otp`;
    console.log("sendOtp - URL:", url);
    console.log("sendOtp - phoneNumber:", phoneNumber);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneNumber }),
    });

    console.log("sendOtp - response status:", response.status);
    const data = await response.json();
    console.log("sendOtp - response data:", data);
    return data;
  } catch (e) {
    console.log("sendOtp - error:", e);
    logCatchErr(e);
    return { success: false, message: "Error de conexion" };
  }
};

export const verifyOtp = async (
  phoneNumber: string,
  code: string
): Promise<OtpResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "No hay sesion activa" };
    }

    const response = await fetch(`${API_URL}account/phone/verify-otp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneNumber, code }),
    });
    return await response.json();
  } catch (e) {
    logCatchErr(e);
    return { success: false, message: "Error de conexion" };
  }
};

export const getPhoneStatus = async (): Promise<PhoneStatusResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { phoneVerified: false };
    }

    const response = await fetch(`${API_URL}account/phone/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (e) {
    logCatchErr(e);
    return { phoneVerified: false };
  }
};
