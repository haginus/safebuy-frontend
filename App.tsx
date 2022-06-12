import { StatusBar } from 'expo-status-bar';
import { Reducer, useEffect, useMemo, useReducer } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext, IAuthContext } from './context/AuthContext';
import * as SecureStore from 'expo-secure-store';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { AuthState } from './lib/model/AuthState';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [state, dispatch] = useReducer<Reducer<AuthState, { type: string, token: string | null }>>(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
      return prevState;
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const authContext = useMemo<IAuthContext>(
    () => ({
      signIn: async (data) => {
        SecureStore.setItemAsync('userToken', data.token);
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => { 
        SecureStore.deleteItemAsync('userToken');
        dispatch({ type: 'SIGN_OUT', token: null });
      }
    }),
    []
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken = null;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }
      // TODO: Validate JWT token
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} authState={state} />
          <StatusBar />
        </SafeAreaProvider>
      </AuthContext.Provider>
    );
  }
}
