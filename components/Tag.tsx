import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { Text } from "./Themed";


export function Tag({ text }: { text: string }) {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    tag: {
      fontSize: 14,
      color: Colors[colorScheme].muted,
      borderRadius: 4,
      padding: 6,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border
    }
  });
  return (
    <Text style={styles.tag}>{text}</Text>
  );
}

