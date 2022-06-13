import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { View } from "./Themed";

interface CircleIconProps {
  icon: string;
  size?: number;
  active?: boolean;
}

export function CircleIcon({ icon, size, active }: CircleIconProps) {
  const _size = size || 25;
  const colorScheme = useColorScheme();
  return (
    <View 
      style={[styles.container, { width: _size * 1.6, height: _size * 1.6 }]}
      lightColor={active ? '#e8eaf6' : '#eee'}
      darkColor={active ? '#222' : '#222'}
    >
      <FontAwesome 
        name={icon as any} 
        size={_size} 
        color={active ? Colors[colorScheme].tint : Colors[colorScheme].muted } 
      />
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