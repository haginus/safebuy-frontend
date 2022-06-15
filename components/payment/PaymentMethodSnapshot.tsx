import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import { useAppSelector } from "../../hooks/storeHooks";
import useColorScheme from "../../hooks/useColorScheme";
import { PaymentMethod } from "../../lib/model/PaymentMethod";
import { formatCardNumber, formatPrice } from "../../lib/util";
import { Text, View as ThemedView } from "../Themed";

type PaymentMethodSnapshotProps = {
  paymentMethod: PaymentMethod | 'balance';
  action?: React.ReactNode;
} & View["props"];


export function PaymentMethodSnapshot({ paymentMethod, action, style, ...otherProps }: PaymentMethodSnapshotProps) {
  const balance = useAppSelector(state => state.payment.balance);
  const selectedListing = useAppSelector(state => state.payment.selectedListing);
  const isDisabled = useMemo(() => selectedListing && paymentMethod == 'balance' && balance < selectedListing?.price, [balance, selectedListing]);
  const isDisabledText = useMemo(() => isDisabled ? ' (Not enough founds)' : '', [isDisabled]);


  const firstLine = useMemo(() => paymentMethod == 'balance' ? 'Balance' + isDisabledText : formatCardNumber(paymentMethod.cardNumber), [paymentMethod, balance]);
  const secondLine = useMemo(() => paymentMethod == 'balance' ? formatPrice(balance, 'RON') : paymentMethod.expiration, [paymentMethod, balance]);
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row', 
      alignItems: 'center'
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16
    },
    containerDisabled: {
      backgroundColor: Colors[colorScheme].backgroundDisabled,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border
    }
  });

  return (
    <ThemedView style={[styles.container, style, isDisabled && styles.containerDisabled]} {...otherProps}>
      <ThemedView style={styles.iconCircle} lightColor="rgba(0, 0, 0, 0.05)" darkColor="rgba(255, 255, 255, 0.05)">
        <MaterialIcons 
          name={paymentMethod == 'balance' ? "account-balance-wallet" : "credit-card"}
          size={24} 
          color={Colors[colorScheme].tint}
        />
      </ThemedView>
      <View style={{ flex: 1 }}>
        <Text style={{ marginBottom: 2 }}>
          {firstLine}
        </Text>
        <Text>{secondLine}</Text>
      </View>
      { action && action }
    </ThemedView>
  );
}

