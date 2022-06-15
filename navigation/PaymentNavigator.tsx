import { MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import PaymentMainScreen from "../screens/payment/PaymentMainScreen";
import PaymentMethodSelectorScreen from "../screens/payment/PaymentMethodSelectorScreen";
import { PaymentStackParamList } from "../types";



export function PaymentNavigator() {
  const Stack = createNativeStackNavigator<PaymentStackParamList>();
  const colorScheme = useColorScheme();
  return (
    <Stack.Navigator screenOptions={({navigation}) => ({
      headerTransparent: true,
      title: '',
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack() }>
          <MaterialIcons name="arrow-back" size={24}></MaterialIcons>
        </Pressable>
      )
    })}>
      <Stack.Screen name="PaymentMain" component={PaymentMainScreen} />
      <Stack.Screen name="PaymentMethodSelector" component={PaymentMethodSelectorScreen} />
    </Stack.Navigator>
  );
}