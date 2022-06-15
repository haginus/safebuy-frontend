import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';

import { PaymentMethodSnapshot } from '../../components/payment/PaymentMethodSnapshot';
import { ArialText } from '../../components/StyledText';
import { SafeAreaView, ScrollView, Text, View as StyledView } from '../../components/Themed';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import useColorScheme from '../../hooks/useColorScheme';
import { PaymentMethod } from '../../lib/model/PaymentMethod';
import { setSelectedPaymentMethod } from '../../store/paymentSlice';
import { PaymentStackScreenProps } from '../../types';


export default function PaymentMethodSelectorScreen({ navigation }: PaymentStackScreenProps<'PaymentMethodSelector'>) {

  const paymentMethods = useAppSelector(state => state.payment.paymentMethods);
  const selectedListing = useAppSelector(state => state.payment.selectedListing);
  const balance = useAppSelector(state => state.payment.balance);
  const balanceAvailable = !!selectedListing;
  const balanceOverPrice = balanceAvailable && balance >= selectedListing?.price;
  const dispatch = useAppDispatch();

  const handleMethodSelect = (paymentMethod: PaymentMethod | 'balance') => {
    dispatch(setSelectedPaymentMethod(paymentMethod));
    navigation.goBack();
  };

  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={[styles.container, GlobalStyles.container]}>
        <Text style={GlobalStyles.header1}>Choose a payment method</Text>
        { balanceAvailable && <TouchableHighlight 
          onPress={() => handleMethodSelect('balance')}
          disabled={!balanceOverPrice}
          style={[{ marginTop: 16, borderRadius: 8 } ]}
        >
          <PaymentMethodSnapshot paymentMethod={'balance'} />
        </TouchableHighlight>
        }

        { paymentMethods.map(paymentMethod => (
            <TouchableHighlight 
              key={paymentMethod.id} 
              onPress={() => handleMethodSelect(paymentMethod)}
              style={[{ marginTop: 16, borderRadius: 8 } ]}
            >
              <PaymentMethodSnapshot paymentMethod={paymentMethod} />
            </TouchableHighlight>
          )
        )}
        <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity>
            <ArialText style={{ color: Colors[colorScheme].tint, fontSize: 18 }}>
              Add card
            </ArialText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
