import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { View, ViewProps } from "./Themed";

type CircleIconProps = {
  icon: string;
  size?: number;
  active?: boolean;
} & ViewProps;

export function CircleIcon({ icon, size, active, ...viewProps }: CircleIconProps) {
  const _size = size || 40;
  const colorScheme = useColorScheme();
  return (
    <View 
      style={[styles.container, { width: _size, height: _size }]}
      lightColor={active ? '#e8eaf6' : '#ddd'}
      darkColor={active ? '#222' : '#222'}
      {...viewProps}
    >
      <MaterialIcons 
        name={icon as any} 
        size={_size / 1.6} 
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