import { Image, StyleSheet, TouchableHighlight, View } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { Listing } from "../lib/model/Listing";
import { Text, View as StyledView } from "./Themed";

export interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const colorScheme = useColorScheme();
  
  return (
    <TouchableHighlight onPress={ onPress } style={ styles.highlight}>
      <StyledView style={styles.listingContainer} darkColor="#222">
        <Image
          style={styles.coverImage}
          source={require("../assets/images/icon.png")}
        />
        <View style={styles.listingInfoContainer}>
          <View>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>{listing.price} lei</Text>
          </View>
          <View>
            <Text style={ { color: Colors[colorScheme].muted }}>
              {listing.owner.firstName} {listing.owner.lastName}
            </Text>
          </View>
        </View>
      </StyledView>
    </TouchableHighlight>
  );

}

const styles = StyleSheet.create({
  highlight: {
    marginBottom: 16,
  },
  listingContainer: {
    display: "flex",
    flexDirection: "row",
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#222",
    shadowOpacity: 0.6,
    height: 140,
    borderRadius: 5
  },
  coverImage: {
    height: 140,
    width: 140,
  },
  listingInfoContainer: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  }
});

