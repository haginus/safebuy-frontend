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
          SearchListingsTab: {
            screens: {
              SearchListingsTab: '/search',
            },
          },
          MyListingsTab: {
            screens: {
              SearchListingsTab: '/listings',
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
      Listing: {
        screens: {
          ListingDetails: 'listings/details/:id',
        }
      },
      NotFound: '*',
    },
  },
};

export default linking;
