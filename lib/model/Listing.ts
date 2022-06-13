import { ListingCategory } from "./ListingCategory";
import { User } from "./User";

export interface Listing {
  id: number;
  title: string;
  description: string;
  needsPersonalization: boolean;
  listingCategory: ListingCategory;
  price: number;
  ownerId: number;
  owner: User;
}