import { MaterialIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useThemeColor } from "./Themed";

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