import { MaterialIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useThemeColor } from "./Themed";
import { GenericError } from "../lib/model/GenericError";

type ErrorMessageProps = { message: string } & View['props'];

export function ErrorMessage({ message, style, ...otherProps }: ErrorMessageProps) {
  const color = useThemeColor({}, 'errorText')
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }, style]} {...otherProps}>
      <MaterialIcons name="warning" size={24} color={color}/>
      <Text style={{ marginLeft: 8, color }}>{message}</Text>
    </View>
  );
}

export function parseError(dispatchResult: any, setError: (message: any) => void) {
  if (dispatchResult.error) {
    const error = dispatchResult.error as GenericError;
    setError(<ErrorMessage message={error.message}/>);
  }
  return null;
}