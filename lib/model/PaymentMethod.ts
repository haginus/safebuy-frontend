export interface PaymentMethod {
  id: number;
  ownerName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
}