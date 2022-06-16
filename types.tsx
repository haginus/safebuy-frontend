/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  Payment: NavigatorScreenParams<PaymentStackParamList>;
  NotFound: undefined;
  Listing: NavigatorScreenParams<ListingStackParamList>;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  Screen
>;

export type PaymentStackScreenProps<Screen extends keyof PaymentStackParamList> = NativeStackScreenProps<
  PaymentStackParamList,
  Screen
>;

export type RootTabParamList = {
  SearchListingsTab: undefined;
  MyListingsTab: undefined;
  SellTab: undefined;
  AccountTab: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type PaymentStackParamList = {
  PaymentMain: { action: 'top-up' } | { action: 'withdraw' } | { action: 'buy-listing', listingId: number };
  PaymentMethodSelector: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ListingStackParamList = {
  ListingDetails: { id: number };
};

export type ListingStackScreenProps<Screen extends keyof ListingStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ListingStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
