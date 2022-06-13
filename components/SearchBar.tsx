import { StyleSheet } from "react-native";
import { CircleIcon } from "./ListingCategoryIcon";
import { Text, TextInput, View } from "./Themed";

export function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.searchBar} 
        lightBackgroundColor="#eee" 
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
    borderBottomColor: "#ddd",
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