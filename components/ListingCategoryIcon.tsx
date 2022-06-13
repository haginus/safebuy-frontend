import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { View } from "./Themed";

interface CircleIconProps {
  icon: string;
  size?: number;
  active?: boolean;
}

export function CircleIcon({ icon, size, active }: CircleIconProps) {
  const _size = size || 25;
  return (
    <View 
      style={[styles.container, { width: _size * 1.6, height: _size * 1.6 }]}
      lightColor={active ? '#e8eaf6' : '#eee'}
    >
      <FontAwesome name={icon as any} size={_size} color={active ? '#3f51b5' : '#444' } />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});