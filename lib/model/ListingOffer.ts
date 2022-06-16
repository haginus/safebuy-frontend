import { User } from "./User";

export type ListingOfferStatus = 'PENDING_SELLER_ACTION' | 'PENDING_BUYER_CONFIRMATION' | 'PENDING_DISPUTE' |
  'ACCEPTED_BY_BUYER' | 'ACCEPTED_BY_SYSTEM' | 'ACCEPTED_BY_DISPUTE' | 'REFUNDED_BY_DISPUTE';

export interface ListingOffer {
  buyerId: number;
  paymentId: string;
  status: ListingOfferStatus;
  lastActionTimestamp: string;
  expiryTimestamp: string;
  buyer?: User;
}