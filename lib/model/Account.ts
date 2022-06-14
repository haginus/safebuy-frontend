import { PaymentMethod } from "./PaymentMethod";

export interface Account {
  userId: number;
  balance: number;
  paymentMethods: PaymentMethod[];
}