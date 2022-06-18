import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, Share, TouchableOpacity } from "react-native";
import { Text } from "../components/Themed";
import Colors from "../constants/Colors";
import { useAppSelector } from "../hooks/storeHooks";
import useColorScheme from "../hooks/useColorScheme";
import { Listing } from "../lib/model/Listing";
import ListingDetailsScreen from "../screens/listing-tab/ListingDetailsScreen";
import ListingEditScreen from "../screens/listing-tab/ListingEditScreen";
import { selectListing } from "../store/marketplaceSlice";

const Stack = createNativeStackNavigator();

export function ListingStackNavigator() {
  const colorScheme = useColorScheme();
  return (
    <Stack.Navigator screenOptions={{ headerTransparent: true, title: '' }}>
      <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} options={({ navigation, route }) => ({ 
        headerLeft: () => headerLeft(navigation),
        headerRight: () => {
          const listingId = (route as any).params.id;
          const listing = useAppSelector(state => selectListing(state, listingId));
          return (
          <TouchableOpacity onPress={() => shareListing(listing)}>
            <MaterialIcons
              name="share"
              size={24}
              color={Colors[colorScheme].text}
            />
          </TouchableOpacity>
        )},
      })} />
      <Stack.Screen name="ListingEdit" component={ListingEditScreen} options={({ navigation, route }) => ({ 
        headerLeft: () => headerLeft(navigation),
      })} />
    </Stack.Navigator>
  );
}

function headerLeft(navigation: any) {
  return (
    <Pressable onPress={() => { 
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace('Root');
      }
      } }>
      <MaterialIcons name="arrow-back" size={24}></MaterialIcons>
    </Pressable>
  );
}

function shareListing(listing: Listing) {
  Share.share(
    {
      message: `Check out this listing: ${listing.title}`,
      url: `safebuy://listings/${listing.id}`,
    },
    {
      dialogTitle: 'Share Listing',
    });
}

