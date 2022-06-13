import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { CircleIcon } from "./ListingCategoryIcon";
import { Text, TextInput, View } from "./Themed";

export function SearchBar() {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.container, { borderBottomColor: Colors[colorScheme].border }]}>
      <TextInput 
        style={styles.searchBar} 
        lightBackgroundColor="#eee"
        darkBackgroundColor="#222"
        placeholder="Search..."
        autoCapitalize="none"
        autoCorrect={false}
      />
      <CircleIcon icon="filter" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
  },
  searchIcon: {
    padding: 10,
    marginRight: -35,
    zIndex: 2,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginRight: 8
  },
});