import { View } from "react-native";
import * as Location from "expo-location";

import HeaderMain from "./HeaderMain";
import MainByRole from "./MainByRole";
import LocationPermissionModal from "./LocationPermissionModal";
import PhoneVerificationModal from "../../../components/PhoneVerificationModal";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../store/auth";

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  const [status, requestPermission] = Location.useForegroundPermissions();

  // Verificar si necesita verificar telefono
  const needsPhoneVerification =
    user?.userInformation?.role !== "super-admin" &&
    !user?.userInformation?.phoneVerified;

  useEffect(() => {
    if (status && !status.granted) {
      setIsOpen(true);
    }
  }, [status]);

  const onAccept = () => {
    setIsOpen(false);
    requestPermission();
  };

  return (
    <View className="flex">
      <LocationPermissionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAccept={onAccept}
      />
      {needsPhoneVerification && <PhoneVerificationModal />}
      <HeaderMain />
      <MainByRole />
    </View>
  );
};

export default MainPage;
