import { useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { useUserStore } from "../../../../store/auth";
import { sendEmailOtp, verifyEmailOtp } from "../../../../api/emailVerificationApi";

type Step = "input" | "verify" | "verified";

interface EmailFormData {
  email: string;
}

interface OtpFormData {
  code: string;
}

interface UseEmailVerificationOptions {
  onComplete?: () => void;
}

const useEmailVerification = ({ onComplete }: UseEmailVerificationOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [email, setEmail] = useState("");

  const user = useUserStore((state) => state.user);
  const updateUserInformation = useUserStore((state) => state.updateUserInformation);

  const emailForm = useForm<EmailFormData>({
    defaultValues: { email: user?.userInformation?.email ?? "" },
  });

  const otpForm = useForm<OtpFormData>({
    defaultValues: { code: "" },
  });

  const onSendOtp = async (data: EmailFormData) => {
    setLoading(true);
    try {
      const result = await sendEmailOtp(data.email);
      if (result.success) {
        setEmail(data.email);
        setStep("verify");
        Toast.show({
          type: "success",
          text1: "Codigo enviado",
          text2: "Revisa tu correo electronico",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message,
        });
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
      const result = await verifyEmailOtp(email, data.code);
      if (result.success) {
        updateUserInformation({ email, emailVerified: true });
        setStep("verified");
        onComplete?.();
        Toast.show({
          type: "success",
          text1: "Verificado",
          text2: "Tu email ha sido verificado exitosamente",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message,
        });
      }
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Error de conexion" });
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const result = await sendEmailOtp(email);
      if (result.success) {
        otpForm.reset();
        Toast.show({
          type: "success",
          text1: "Codigo reenviado",
          text2: "Revisa tu correo electronico",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message,
        });
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
    setEmail("");
    emailForm.reset({ email: "" });
    otpForm.reset();
  };

  return {
    loading,
    step,
    email,
    emailForm,
    otpForm,
    onSendOtp,
    onVerifyOtp,
    onResendOtp,
    onGoBack,
    onReset,
  };
};

export default useEmailVerification;
