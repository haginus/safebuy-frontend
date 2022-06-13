import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import ListingDetailsScreen from "../screens/listing-tab/ListingDetailsScreen";
import ListingTabHome from "../screens/listing-tab/ListingTabHome";

const Stack = createNativeStackNavigator();

export function ListingTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListingTabHome" component={ListingTabHome} />
      <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
    </Stack.Navigator>
  );
}

