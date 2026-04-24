import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { logCatchErr } from "../../../../api/utils/crashlytics";
import { useUserStore } from "../../../../store/auth";
import { getUserData } from "../../../../utils/firestore";
import { getUserDataDebug } from "../../../../utils/firestore-debug";

const useSignIn = () => {
  const [loading, setLoading] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkUserInformationByUid = async (
    uid: string,
    userCredentials: any
  ) => {
    console.log('=== CHECKING USER ===');
    console.log('UID:', uid);
    const userInformation = await getUserDataDebug(uid);
    console.log('userInformation returned:', userInformation);
    if (
      !userInformation ||
      !userInformation.active ||
      userInformation.active === "false"
    ) {
      Toast.show({
        type: "error",
        text1: "Usuario no activo",
        text2: "Usuario no esta activo en la plataforma",
      });
      return setLoading(false);
    }
    if (userInformation.role === "client") {
      Toast.show({
        type: "error",
        text1: "Cliente no permitido",
        text2: "Los clientes no pueden ingresar a la app",
      });
      return setLoading(false);
    }
    if (userInformation.role === "guard" && !userInformation.contractorUuid) {
      Toast.show({
        type: "error",
        text1: "personal sin asignación",
        text2:
          "El personal requiere estar asignado a una instalación para ingresar a la app",
      });
      return setLoading(false);
    }
    if (
      userInformation.active === "false" ||
      userInformation.active === false
    ) {
      Toast.show({
        type: "error",
        text1: "Usuario inactivo",
        text2:
          "El usuario esta inactivo, contacte al administrador para activarlo",
      });
      return setLoading(false);
    }
    setUser({
      ...userCredentials._tokenResponse,
      uuid: userCredentials.user.uid,
      userInformation,
    });
  };

  const onLoginWithCustomToken = async (customToken: string) => {
    try {
      const userCredentials: any =
        await auth().signInWithCustomToken(customToken);
      await checkUserInformationByUid(
        userCredentials.user.uid,
        userCredentials
      );
    } catch (error) {
      logCatchErr(error);
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: "Error al iniciar sesión con el token personalizado",
      });
      setLoading(false);
    }
  };

  const onPressLogin = async (data: any) => {
    setLoading(true);
    try {
      const userCredentials: any = await auth().signInWithEmailAndPassword(
        data.email,
        data.password
      );
      await checkUserInformationByUid(
        userCredentials.user.uid,
        userCredentials
      );
    } catch (error) {
      console.log({ error });
      logCatchErr(error);
      Toast.show({
        type: "error",
        text1: "Credenciales incorrectas",
        text2: "Error al iniciar sesión, revise sus credenciales",
      });
      setLoading(false);
    }
  };

  return {
    loading,
    onPressLogin,
    control,
    onLoginWithCustomToken,
    handleSubmit,
  };
};

export default useSignIn;
