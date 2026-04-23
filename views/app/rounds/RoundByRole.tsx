import { Text } from "react-native";

import RoundList from "./RoundList";
import RoundListSupervisor from "./supervisor/RoundListSupervisor";
import { useUserStore } from "../../../store/auth";

const RoundByRole = () => {
  const user = useUserStore((state) => state.user);

  if (user?.userInformation.role === "personal") {
    return <RoundList />;
  }

  if (user?.userInformation.role === "supervisor") {
    return <RoundListSupervisor />;
  }

  return (
    <Text className="font-bold">
      Seleccione un elemento del menu para continuar
    </Text>
  );
};

export default RoundByRole;
