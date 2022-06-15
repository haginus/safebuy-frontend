import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { Button } from '../components/Button';
import { ArialText } from '../components/StyledText';

import { ScrollView, Text, View as ThemedView } from '../components/Themed';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import { AuthContext } from '../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import useColorScheme from '../hooks/useColorScheme';
import { User } from '../lib/model/User';
import { formatPrice } from '../lib/util';
import { fetchAccount } from '../store/paymentSlice';
import { RootTabScreenProps } from '../types';

export default function AccountScreen({ navigation }: RootTabScreenProps<'AccountTab'>) {
  const user = useAppSelector(state => state.user.currentUser) as User;
  const balance = useAppSelector(state => state.payment.balance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(!user) return;
    dispatch(fetchAccount());
  }, [user]);

  const colorScheme = useColorScheme();

  const { signOut } = useContext(AuthContext);
  
  return user && (
    <ScrollView style={styles.container}>
      <View style={styles.accountHeader}>
        <View style={[styles.circle, { borderColor: Colors[colorScheme].border }]}>
          <MaterialIcons name='person' size={36} color="#fff"></MaterialIcons>
        </View>
        <ArialText style={styles.username}>{user.firstName} {user.lastName}</ArialText>
      </View>
      <ThemedView style={[GlobalStyles.section]}>
        <ArialText style={styles.balance}>{ formatPrice(balance, 'RON') }</ArialText>
        <View style={[styles.balanceSectionButtons]}>
          <Button icon='add' title='Top up' style={styles.balanceSectionButton} 
            onPress={() => navigation.push('Payment', { screen: 'PaymentMain', params: { action: 'top-up' } })}/>
          <Button icon='remove' title='Withdraw'
            onPress={() => navigation.push('Payment', { screen: 'PaymentMain', params: { action: 'withdraw' } })}/>
        </View>
      </ThemedView>

      <TouchableHighlight style={styles.sectionHighlight} onPress={signOut}>
        <ThemedView style={[GlobalStyles.section, { flexDirection: 'row', alignItems: 'center', marginHorizontal: 0 }]}>
          <MaterialIcons name='logout' size={24} color={Colors[colorScheme].text}></MaterialIcons>
          <Text style={{ marginLeft: 12 }}>Sign out</Text>
        </ThemedView>
      </TouchableHighlight>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  accountHeader: {
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: '#8d6e63',
    alignItems: 'center',
    justifyContent: 'center'
  },
  username: {
    fontSize: 26,
    marginLeft: 12
  },
  balanceSectionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  balanceSectionButton: {
    marginRight: 8
  },
  balance: {
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0.7
  },
  sectionHighlight: {
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 16
  }
});
