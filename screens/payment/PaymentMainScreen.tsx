import { createRef, Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { ActivityIndicator, NativeSyntheticEvent, Platform, StyleSheet, TextInput, TextInputKeyPressEventData, TextInputSelectionChangeEventData, View } from 'react-native';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ListingCard } from '../../components/ListingCard';
import { PaymentMethodSnapshot } from '../../components/payment/PaymentMethodSnapshot';

import { SafeAreaView, ScrollView, Text, View as StyledView } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useGlobalStyles } from '../../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import useColorScheme from '../../hooks/useColorScheme';
import { formatPrice } from '../../lib/util';
import { fetchMyListings, selectListing } from '../../store/marketplaceSlice';
import { buyListing, makeAccountTransaction, setSelectedListing, setSelectedPaymentMethod } from '../../store/paymentSlice';
import { PaymentStackScreenProps } from '../../types';

const MIN_TRANSACTION_AMOUNT = 20;


export default function PaymentMainScreen({ navigation, route }: PaymentStackScreenProps<'PaymentMain'>) {
  const GlobalStyles = useGlobalStyles();

  const actionType = route.params;

  const title = useMemo(() => {
    switch (actionType.action) {
      case 'top-up':
        return 'Add money';
      case 'withdraw':
        return 'Withdraw money';
      case 'buy-listing':
        return 'Buy listing';
    }
  }, [route]);
        

  const balance = useAppSelector(state => state.payment.balance);
  const paymentMethods = useAppSelector(state => state.payment.paymentMethods);
  const selectedPaymentMethod = useAppSelector(state => state.payment.selectedPaymentMethod);
  const listing = useAppSelector(state => selectListing(state, Number(actionType.action == 'buy-listing' && actionType.listingId)))
  const dispatch = useAppDispatch();

  const [amountValue, setAmountValue] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const amountInput = createRef<TextInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAboveMinAmount = useMemo(() => parseFloat(amountValue) >= MIN_TRANSACTION_AMOUNT, [amountValue]);
  const isAboveBalance = useMemo(() => actionType.action != 'top-up' && parseFloat(amountValue) > balance, [amountValue, balance]);
  const amountError = useMemo(() => (actionType.action != 'buy-listing' && (!isAboveMinAmount || isAboveBalance)), [amountValue, isAboveMinAmount, isAboveMinAmount])

  function handleSelectionChange(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
    console.log(event.nativeEvent.selection)
    setSelection(event.nativeEvent.selection);
  }

  function handleKeyPress(event: NativeSyntheticEvent<TextInputKeyPressEventData>) {
    event.preventDefault();

    // This is way too picky and i have 3 more days to finish the app :)
    const key = event.nativeEvent.key;
    let amount = amountValue.split(' ')[0];
    if(key == 'Backspace') {
      // if(selection.start == selection.end && selection.end == amountValue.length) {
        amount = amount.substring(0, amount.length - 1);
        console.log(amount)
      // } else {
      //   let amountArr = amount.split('')
      //   amountArr.splice(selection.start, selection.end - selection.start)
      //   amount = amountArr.join('');
      // }
    } else {
      amount += key;
    }
    const newAmount = amount.length ? amount + ' RON' : '';
    setAmountValue(newAmount);
    const newSelection = { start: newAmount.length, end: newAmount.length }
    setSelection(newSelection);
    amountInput.current?.setNativeProps({ selection: newSelection })
  }

  const handlePay = async () => {
    if(isLoading || !selectedPaymentMethod) return;
    setIsLoading(true);
    if(actionType.action != 'buy-listing') {
      let result = await dispatch(makeAccountTransaction({ 
        amount: parseFloat(amountValue), 
        paymentMethod: selectedPaymentMethod,
        type: actionType.action
      }))
      if(result.meta.requestStatus == 'fulfilled') {
        navigation.goBack();
      } else {
        setErrorMessage((result as any).error.message);
        setIsLoading(false);
      }
    } else {
      let result = await dispatch(buyListing({ 
        amount: listing.price,
        paymentMethod: selectedPaymentMethod,
        listingId: actionType.listingId,
      }));
      if(result.meta.requestStatus == 'fulfilled') {
        await dispatch(fetchMyListings());
        navigation.goBack();
      } else {
        setErrorMessage((result as any).error.message);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    dispatch(setSelectedPaymentMethod(paymentMethods[0]));
    if(actionType.action == 'buy-listing') {
      dispatch(setSelectedListing(listing));
    }
    return () => {
      dispatch(setSelectedListing(null));
    }
  }, [paymentMethods]);


  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={[styles.container, GlobalStyles.container]}>
        <Text style={GlobalStyles.header1}>{title}</Text>
        { !!errorMessage && <ErrorMessage message={errorMessage}/> }
        { actionType.action != 'buy-listing' &&
          <StyledView style={[styles.section ]}>
            <View style={styles.amountLine}>
              <Text></Text>
              <TextInput
                style={styles.amount}
                placeholder='0 RON' 
                keyboardType='numeric' 
                onSelectionChange={handleSelectionChange}
                ref={amountInput}
                onKeyPress={handleKeyPress}
                value={amountValue}
              />
            </View>
            <View style={[styles.amountLine, { marginTop: 8 }]}>
              <Text style={[{ color: Colors[colorScheme].muted }, amountError && { color: Colors[colorScheme].errorText }]}>
                Balance: {formatPrice(balance, 'RON')}
              </Text>
              { !isAboveMinAmount && <Text style={[{ color: Colors[colorScheme].errorText }]}>{formatPrice(MIN_TRANSACTION_AMOUNT, 'RON')} minimum</Text>}
            </View>
          </StyledView>
        }
        { actionType.action == 'buy-listing' && <ListingCard listing={listing} small/>}
        { selectedPaymentMethod && <PaymentMethodSnapshot 
          paymentMethod={selectedPaymentMethod} 
          style={[{ marginTop: 16 } ]} 
          action={<Button title='Change' onPress={() => navigation.push('PaymentMethodSelector')}/>} 
        /> }
        <Button 
          title={isLoading ? '' : title} 
          theme='solid_rounded' 
          icon={() => isLoading && <ActivityIndicator color='#fff'/>}
          onPress={handlePay}
          disabled={isLoading || !selectedPaymentMethod || amountError}
          style={[{ marginTop: 24 }]}
          />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    padding: 16,
    borderRadius: 8,
  },
  amountLine: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  amount: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Arial'
  }
});
