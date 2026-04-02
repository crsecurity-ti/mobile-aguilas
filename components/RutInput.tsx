import { useEffect } from "react";
import { TextInput } from "react-native";

import { useRut } from "../hooks/useRut";

const RutInput = ({
  onChange,
  value,
  initialValue,
  uuid,
}: {
  onChange: (value: string) => void;
  value: string;
  uuid: string;
  initialValue?: string;
}) => {
  const { rut, updateRut } = useRut();

  useEffect(() => {
    updateRut(initialValue ?? "");
  }, [uuid]);

  const onChangeTextValue = (valueInput: string) => {
    updateRut(valueInput, (rut) => {
      onChange(rut);
    });
  };

  return (
    <TextInput
      className="border border-gray-300 rounded-md p-2 mb-4"
      value={rut.formatted}
      onChangeText={(valueInput) => onChangeTextValue(valueInput)}
    />
  );
};

export default RutInput;
