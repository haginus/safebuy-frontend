import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, Share, TouchableOpacity } from "react-native";
import { Text } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ListingDetailsScreen from "../screens/listing-tab/ListingDetailsScreen";

const Stack = createNativeStackNavigator();

export function ListingStackNavigator() {
  const colorScheme = useColorScheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} options={({ navigation, route }) => ({ 
        headerTransparent: true,
        title: '',
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack() }>
            <MaterialIcons name="arrow-back" size={24}></MaterialIcons>
          </Pressable>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => shareListing((route as any).params.id)}>
            <MaterialIcons
              name="share"
              size={24}
              color={Colors[colorScheme].text}
            />
          </TouchableOpacity>
        ),
      })} />
    </Stack.Navigator>
  );
}

function shareListing(listingId: number) {
  Share.share(
    {
      message: `Check out this listing!`,
      url: `com.haginus.safebuyfrontend://listings/${listingId}`,
    },
    {
      dialogTitle: 'Share Listing',
    });
}

