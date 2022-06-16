import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, Share } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ListingDetailsScreen from "../screens/listing-tab/ListingDetailsScreen";

const Stack = createNativeStackNavigator();

export function ListingStackNavigator() {
  const colorScheme = useColorScheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} options={({ navigation, route }) => ({ 
        headerBackTitle: '',
        headerTransparent: true,
        title: '',
        headerRight: () => (
          <Pressable
            onPress={() => shareListing((route as any).params.id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
              name="share-alt"
              size={25}
              color={Colors[colorScheme].text}
            />
          </Pressable>
        ),
        
      })} />
    </Stack.Navigator>
  );
}

function shareListing(listingId: number) {
  Share.share(
    {
      title: 'Share Listing',
      message: `https://www.example.com/listing/${listingId}`,
      url: `com.haginus.safebuyfrontend://listing/${listingId}`,
    },
    {
      dialogTitle: 'Share Listing',
    });
}

