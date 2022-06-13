import { Image, StyleSheet, TouchableHighlight } from "react-native";
import { Listing } from "../lib/model/Listing";
import { Text, View } from "./Themed";

export interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  return (
    <TouchableHighlight onPress={ onPress } style={ styles.highlight}>
      <View style={styles.listingContainer}>
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
            <Text style={styles.ownerInfo}>
              {listing.owner.firstName} {listing.owner.lastName}
            </Text>
          </View>
        </View>
      </View>
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
  ownerInfo: {
    color: "#444",
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

