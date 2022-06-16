import { StyleSheet } from "react-native"
import useColorScheme from "../hooks/useColorScheme";
import _Colors from "./Colors";

export const useGlobalStyles = () => {
  const colorScheme = useColorScheme();
  const Colors = _Colors[colorScheme];
  return StyleSheet.create({
    container: {
      padding: 16
    },
    section: {
      padding: 16,
      marginHorizontal: 12,
      borderRadius: 8,
    },
    sectionHeader: {
      fontWeight: "500",
      marginBottom: 8,
    },
    header1: {
      fontWeight: '700',
      fontFamily: 'Arial',
      lineHeight: 40,
      fontSize: 32,
      marginBottom: 16,
    },
    horizSectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      backgroundColor: 'transparent',
    },
    horizSectCt: {
      flexDirection: 'column',
      borderRadius: 8,
      marginBottom: 16,
    },
    horizSect: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    horizSectText: {
      fontWeight: '500',
      color: Colors.muted,
    },
    textAction: {
      color: Colors.tint,
      fontWeight: '500',
    },
    explanatory: {
      color: Colors.muted,
      fontSize: 12,
      marginBottom: 8,
    }
  })
}