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
}

export interface EmailStatusResponse {
  email?: string;
  emailVerified: boolean;
}

export const sendEmailOtp = async (email: string): Promise<OtpResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "No hay sesion activa" };
    }

    const response = await fetch(`${API_URL}account/email/send-otp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (e) {
    logCatchErr(e);
    return { success: false, message: "Error de conexion" };
  }
};

export const verifyEmailOtp = async (
  email: string,
  code: string
): Promise<OtpResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "No hay sesion activa" };
    }

    const response = await fetch(`${API_URL}account/email/verify-otp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, code }),
    });

    return await response.json();
  } catch (e) {
    logCatchErr(e);
    return { success: false, message: "Error de conexion" };
  }
};

export const getEmailStatus = async (): Promise<EmailStatusResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { emailVerified: false };
    }

    const response = await fetch(`${API_URL}account/email/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (e) {
    logCatchErr(e);
    return { emailVerified: false };
  }
};
