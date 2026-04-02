import { Text } from "react-native";

interface ErrorComponentProps {
  text?: string;
}

const ErrorComponent = ({ text = "Error Cargando el mapa" }: ErrorComponentProps) => (
  <Text className="font-bold text-center mt-10">
    {text}
  </Text>
);

export default ErrorComponent;
