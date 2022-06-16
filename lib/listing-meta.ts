import { ListingDetails } from "./model/Listing";
import { ListingOfferStatus } from "./model/ListingOffer";

export interface ListingMeta {
  perspective: "seller" | "buyer";
  originalStatus: ListingOfferStatus | null;
  status: 'PUBLISHED' | ListingOfferStatus;
  totalSteps: number;
  currentStep: number;
  shortStatus: string;
  longStatus: string;
  isAccepted: boolean;
  isRefunded: boolean;
  isPending: boolean;
}

export function getListingMeta(listing: ListingDetails, currentUserId?: number): ListingMeta | null {
  if(listing.ownerId != currentUserId && listing.listingOffer?.buyerId != currentUserId) {
    return null;
  }
  const perspective = listing.ownerId == currentUserId ? "seller" : "buyer";
  const originalStatus = listing.listingOffer?.status;
  const totalSteps = listing.needsPersonalization ? 3 : 2;
  if(!originalStatus) {
    return {
      perspective,
      originalStatus: null,
      status: "PUBLISHED",
      totalSteps,
      currentStep: 0,
      ...statusMap.PUBLISHED.seller,
      isAccepted: false,
      isRefunded: false,
      isPending: false,
    }
  }
  const isAccepted = originalStatus === "ACCEPTED_BY_BUYER" || originalStatus === "ACCEPTED_BY_SYSTEM" || originalStatus === "ACCEPTED_BY_DISPUTE";
  const isPending = originalStatus === "PENDING_SELLER_ACTION" || originalStatus === "PENDING_BUYER_CONFIRMATION" || originalStatus === "PENDING_DISPUTE";
  const isRefunded = originalStatus === "REFUNDED_BY_DISPUTE";
  const currentStep = isAccepted || isRefunded ? totalSteps + 1 : (originalStatus === "PENDING_SELLER_ACTION" ? 2 : 3);

  return {
    perspective,
    originalStatus,
    status: originalStatus,
    totalSteps,
    currentStep,
    ...statusMap[originalStatus][perspective],
    isAccepted,
    isRefunded,
    isPending,
  };
}

interface Status {
  shortStatus: string;
  longStatus: string;
}

type PerspectiveStatus = { [ key in ListingMeta['perspective'] ]: Status };

const statusMap: { [key in ListingMeta['status']]: PerspectiveStatus } = {
  PUBLISHED: {
    seller: {
      shortStatus: "Published",
      longStatus: "Your listing is published and waiting for a buyer."
    },
    buyer: {
      shortStatus: "Published",
      longStatus: "Listing is published and waiting for a buyer."
    },
  },
  PENDING_SELLER_ACTION: {
    seller: {
      shortStatus: "Your action pending",
      longStatus: "It's time to personalize the asset."
    },
    buyer: {
      shortStatus: "Pending seller action",
      longStatus: "The seller is personalizing the asset for you. We'll let you know when it's ready."
    },
  },
  PENDING_BUYER_CONFIRMATION: {
    seller: {
      shortStatus: "Pending buyer confirmation",
      longStatus: "The buyer will analyze the asset and confirm everything is alright."
    },
    buyer: {
      shortStatus: "Pending your action",
      longStatus: "Please check the assets submitted and confirm everything is alright."
    }
  },
  PENDING_DISPUTE: {
    seller: {
      shortStatus: "Pending dispute",
      longStatus: "The buyer rejected your submitted assets. We are reviewing them as well and will let you know our decision."
    },
    buyer: {
      shortStatus: "Pending dispute",
      longStatus: "You rejected the submitted assets. We are reviewing them as well and will let you know our decision."
    }
  },
  ACCEPTED_BY_BUYER: {
    seller: {
      shortStatus: "Sold",
      longStatus: "The buyer has confirmed the assets. Money went to your balance."
    },
    buyer: {
      shortStatus: "Confirmed",
      longStatus: "You have confirmed the assets. Money went to the seller."
    }
  },
  ACCEPTED_BY_SYSTEM: {
    seller: {
      shortStatus: "Sold",
      longStatus: "Assets were accepted automatically. Money went to your balance."
    },
    buyer: {
      shortStatus: "Sold",
      longStatus: "Assets were accepted automatically. Money went to the seller."
    }
  },
  ACCEPTED_BY_DISPUTE: {
    seller: {
      shortStatus: "Sold",
      longStatus: "We reviewed the assets and decided to accept them. Money went to your balance."
    },
    buyer: {
      shortStatus: "Confirmed",
      longStatus: "We reviewed the assets and decided to accept them. Money went to the seller."
    }
  },
  REFUNDED_BY_DISPUTE: {
    seller: {
      shortStatus: "Refunded",
      longStatus: "We reviewed the assets and decided to reject them."
    },
    buyer: {
      shortStatus: "Refunded",
      longStatus: "We reviewed the assets and decided to reject them. Money went back to your balance."
    }
  }
};