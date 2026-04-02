import * as React from "react";
import { FieldError } from "react-hook-form";
import { TextInput } from "react-native";

interface ValidationMap {
  [key: string]: any;
}

interface ErrorMap {
  [key: string]: FieldError | undefined;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  register: (field: { name: string }, validation?: any) => void;
  errors: ErrorMap;
  validation: ValidationMap;
  setValue: (name: string, value: string, validate?: boolean) => void;
}

export default ({
  register,
  errors,
  setValue,
  validation,
  children,
}: Props) => {
  const Inputs = React.useRef<TextInput[]>([]);

  React.useEffect(() => {
    (Array.isArray(children) ? [...children] : [children]).forEach((child) => {
      if (child.props.name)
        register({ name: child.props.name }, validation[child.props.name]);
    });
  }, [register]);

  return (
    <>
      {(Array.isArray(children) ? [...children] : [children]).map(
        (child, i) => {
          return child.props.name
            ? React.createElement(child.type, {
                ...{
                  ...child.props,
                  ref: (e: TextInput) => {
                    Inputs.current[i] = e;
                  },
                  onChangeText: (v: string) =>
                    setValue(child.props.name, v, true),
                  onSubmitEditing: () => {
                    return Inputs.current[i + 1]
                      ? Inputs.current[i + 1].focus()
                      : Inputs.current[i].blur();
                  },
                  //onBlur: () => triggerValidation(child.props.name),
                  blurOnSubmit: false,
                  //name: child.props.name,
                  error: errors[child.props.name],
                },
              })
            : child;
        },
      )}
    </>
  );
};
