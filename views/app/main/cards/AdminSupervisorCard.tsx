import { useRouter } from "expo-router";
import { Text } from "react-native";

import SimpleCardDS from "../../../../components/SimpleCardDS";

const AdminSupervisorCard = () => {
  const router = useRouter();
  return (
    <SimpleCardDS
      onPressButton={() =>
        router.navigate({
          pathname: "/list-contractors-general",
        })
      }
      textButton="Ir a instalaciones"
      body={
        <>
          <Text className="font-bold text-xl pb-2">Supervisores - General</Text>
          <Text>Revisar Instalaciones</Text>
        </>
      }
    />
  );
};

export default AdminSupervisorCard;
