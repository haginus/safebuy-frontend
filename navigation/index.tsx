/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { AuthState } from '../lib/model/AuthState';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { ListingStackNavigator } from './ListingStackNavigator';
import AccountScreen from '../screens/AccountScreen';
import { PaymentNavigator } from './PaymentNavigator';
import ListingEditScreen from '../screens/listing-tab/ListingEditScreen';
import SearchListingsTab from '../screens/bottom-tabs/SearchListingsTab';

export default function Navigation({ colorScheme, authState }: { colorScheme: ColorSchemeName, authState: AuthState }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      fallback={<SplashScreen/>}>
      <RootNavigator authState={ authState } />
    </NavigationContainer>
  );
}


function RootNavigator({ authState }: { authState: AuthState }) {
  /**
   * A root stack navigator is often used for displaying modals on top of all other content.
   * https://reactnavigation.org/docs/modal
   */
 const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      {authState.isLoading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : authState.userToken ? (
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false, animationTypeForReplace: authState.isSignout ? 'pop' : 'push' }} />
      ) }
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Payment" component={PaymentNavigator} options={{ headerShown: false, }} />
      <Stack.Screen name="Listing" component={ListingStackNavigator} options={{ headerShown: false, }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} options={{ title: 'What is a personalized ticket?' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign in' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign up' }} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="MyListingsTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="SearchListingsTab"
        component={SearchListingsTab}
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon  name="shopping-search" color={color} />,
        }}
      />
       <BottomTab.Screen
        name="MyListingsTab"
        component={MyListingsScreen}
        options={{
          headerShown: false,
          title: 'Your listings',
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <TabBarIcon name="account-circle" color={color} />,
        }}
      />
    </BottomTab.Navigator>
    
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={24} style={{ marginBottom: -3 }} {...props} />;
}
