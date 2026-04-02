import { Text } from "react-native";

interface PermissionBadgeProps {
  loading: boolean;
  status: "granted" | "denied" | "undetermined";
}

const PermissionBadge = ({ loading, status }: PermissionBadgeProps) => {
  const text = {
    granted: "Activo",
    denied: "Denegado",
    undetermined: "No Determinado",
  };

  if (loading) return <Text className="text-yellow-500">Cargando...</Text>;

  return <Text className="text-green-500">{text[status]}</Text>;
};

export default PermissionBadge;
