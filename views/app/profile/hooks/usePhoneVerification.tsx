import { useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { useUserStore } from "../../../../store/auth";
import { sendOtp, verifyOtp } from "../../../../api/phoneVerificationApi";

type Step = "input" | "verify" | "verified";

interface PhoneFormData {
  phoneNumber: string;
}

interface OtpFormData {
  code: string;
}

interface UsePhoneVerificationOptions {
  onComplete?: () => void;
}

const usePhoneVerification = ({ onComplete }: UsePhoneVerificationOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const user = useUserStore((state) => state.user);
  const updateUserInformation = useUserStore((state) => state.updateUserInformation);

  const phoneForm = useForm<PhoneFormData>({
    defaultValues: { phoneNumber: "" },
  });

  const otpForm = useForm<OtpFormData>({
    defaultValues: { code: "" },
  });

  const onSendOtp = async (data: PhoneFormData) => {
    setLoading(true);
    try {
      const result = await sendOtp(data.phoneNumber);
      if (result.success) {
        setPhoneNumber(data.phoneNumber);
        setStep("verify");
        if (result.expiresAt) {
          setExpiresAt(new Date(result.expiresAt));
        }
        Toast.show({
          type: "success",
          text1: "Codigo enviado",
          text2: "Revisa tus mensajes SMS",
        });
      } else {
        Toast.show({ type: "error", text1: "Error", text2: result.message });
      }
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Error de conexion" });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data: OtpFormData) => {
    setLoading(true);
    try {
      const result = await verifyOtp(phoneNumber, data.code);
      if (result.success) {
        updateUserInformation({ phoneNumber, phoneVerified: true });
        setStep("verified");
        onComplete?.();
        Toast.show({
          type: "success",
          text1: "Verificado",
          text2: "Tu telefono ha sido verificado exitosamente",
        });
      } else {
        Toast.show({ type: "error", text1: "Error", text2: result.message });
      }
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Error de conexion" });
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!phoneNumber) return;
    setLoading(true);
    try {
      const result = await sendOtp(phoneNumber);
      if (result.success) {
        if (result.expiresAt) {
          setExpiresAt(new Date(result.expiresAt));
        }
        otpForm.reset();
        Toast.show({
          type: "success",
          text1: "Codigo reenviado",
          text2: "Revisa tus mensajes SMS",
        });
      } else {
        Toast.show({ type: "error", text1: "Error", text2: result.message });
      }
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Error de conexion" });
    } finally {
      setLoading(false);
    }
  };

  const onGoBack = () => {
    setStep("input");
    otpForm.reset();
  };

  const onReset = () => {
    setStep("input");
    setPhoneNumber("");
    phoneForm.reset({ phoneNumber: "" });
    otpForm.reset();
  };

  return {
    loading,
    step,
    phoneNumber,
    expiresAt,
    phoneForm,
    otpForm,
    onSendOtp,
    onVerifyOtp,
    onResendOtp,
    onGoBack,
    onReset,
  };
};

export default usePhoneVerification;
