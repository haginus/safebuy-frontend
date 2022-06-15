import { PaymentMethod } from "./PaymentMethod";

export type TransactionType = "TOP_UP" | "WITHDRAW" | "LISTING_BUY" | "LISTING_SELL" | "LISTING_REFUND";

export interface Transaction {
  id: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  timestamp: string;
  details: string | null;
}