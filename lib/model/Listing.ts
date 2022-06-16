import { Asset } from "./Asset";
import { ListingCategory } from "./ListingCategory";
import { ListingOffer } from "./ListingOffer";
import { User } from "./User";

export interface ListingBase {
  title: string;
  description: string;
  needsPersonalization: boolean;
  price: number;
  ownerId: number;
}

export interface Listing extends ListingBase {
  id: number;
  listingCategory: ListingCategory;
  owner?: User;
}

export interface ListingDetails extends Listing {
  assets: Asset[];
  listingOffer: ListingOffer;
}

export interface ListingCreate extends ListingBase {
  listingCategoryId: number;
  assets: Asset[];
}