import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useThemeColor } from "./Themed";

export function OfflineComponent() {
  const color = useThemeColor({}, 'muted');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <MaterialIcons name="cloud-off" size={92} color={color} />
      <Text style={{ color, fontSize: 32, marginTop: 16 }}>You are offline</Text>
    </View>
  );
}