/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          SignIn: 'auth/sign-in',
          SignUp: 'auth/sign-up',
        }
      },
      Root: {
        screens: {
          ListingTab: {
            screens: {
              ListingTabHome: 'listings',
              ListingDetails: 'listings/details/:id',
            },
          },
          SellTab: {
            screens: {
              SellTab: 'sell',
            },
          },
          AccountTab: {
            screens: {
              AccountTab: 'account',
            },
          },
        },
      },
      Modal: 'modal',
      Payment: {
        screens: {
          PaymentMain: 'payment/:action/:listingId?'
        }
      },
      NotFound: '*',
    },
  },
};

export default linking;
