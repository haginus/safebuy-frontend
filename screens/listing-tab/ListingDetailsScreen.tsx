import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AssetSection, { AssetSectionMode } from '../../components/AssetSection';
import { Button } from '../../components/Button';
import { parseError } from '../../components/ErrorMessage';
import { ArialText } from '../../components/StyledText';
import { Tag } from '../../components/Tag';
import { Text, View, ScrollView } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useGlobalStyles } from '../../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import useColorScheme from '../../hooks/useColorScheme';
import { Service } from '../../lib/constants';
import { getListingMeta } from '../../lib/listing-meta';
import { Asset } from '../../lib/model/Asset';

import { ListingDetails } from '../../lib/model/Listing';
import { ListingOffer } from '../../lib/model/ListingOffer';
import { AnimationAB, apiCall, formatPrice } from '../../lib/util';
import { fetchListing, fetchMyListings, selectListing } from '../../store/marketplaceSlice';
import { ListingStackScreenProps, } from '../../types';

export default function ListingDetailsScreen({ navigation, route }: ListingStackScreenProps<'ListingDetails'>) {
  const { id: listingId } = route.params;
  const colorScheme = useColorScheme();
  const listing: ListingDetails = useAppSelector(state => selectListing(state, listingId));
  const userId = useAppSelector(state => state.user.currentUser?.id);
  const dispatch = useAppDispatch();

  const listingMeta = useMemo(() => getListingMeta(listing, userId), [listing, userId]);

  const pendingAnim = useRef(new AnimationAB({
    opacity: {
      from: 0.2,
      to: 1,
    }
  }, {
    duration: 1200,
  })).current;

  useEffect(() => {
    dispatch(fetchListing(listingId));
    pendingAnim.alternate(() => listingMeta?.isPending);
  }, []);

  useEffect(() => {
    setAssets(listing.assets || []);
  }, [listing]);

  const [assets, setAssets] = useState<Asset[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  const buyListing = () => {
    navigation.push('Payment', { screen: 'PaymentMain', params: { action: 'buy-listing', listingId: listing.id } });
  }

  const sellerConfirm = () => {
    return apiCall<ListingOffer>(Service.MARKETPLACE, `/listings/${listingId}/offer/seller-confirm`, "POST");
  }

  const buyerConfirm = () => {
    return apiCall<ListingOffer>(Service.MARKETPLACE, `/listings/${listingId}/offer/buyer-confirm`, "POST");
  }

  const buyerDecline = () => {
    return apiCall<ListingOffer>(Service.MARKETPLACE, `/listings/${listingId}/offer/buyer-decline`, "POST");
  }

  const goEdit = () => {
    navigation.push('ListingEdit', { id: listing.id })
  }

  const dispatchAction = async (fn: () => Promise<any>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await fn();
      await dispatch(fetchMyListings());
    } catch(error) {
      parseError({ error }, setSubmitError, { style: { marginTop: 16, marginBottom: 0 } });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchListing(listingId));
    setIsRefreshing(false);
  }

  const GlobalStyles = useGlobalStyles();

  return (
    <ScrollView style={styles.scrollView} refreshControl={
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />}
    >
      { listing && <SafeAreaView>
        <Image
          style={styles.coverImage}
          source={require("../../assets/images/icon.png")}
        />
        <View style={styles.titleView}>
          <Text style={styles.title}>{listing.title}</Text>
          <ArialText style={[styles.price, { color: Colors[colorScheme].tint }]}>
            {formatPrice(listing.price)}
          </ArialText>
          { !isSubmitting && <View style={styles.listingActions}>
            { !listingMeta && <Button icon="shopping-basket" title='Buy' onPress={buyListing} /> }
            { listingMeta && (
              (
                listingMeta.perspective == 'seller' && (
                  (!listingMeta.originalStatus && <Button icon="edit" title='Edit' onPress={goEdit} />) ||
                  (listingMeta.originalStatus == 'PENDING_SELLER_ACTION' && <Button icon="check" title='Done' onPress={() => dispatchAction(sellerConfirm)} />)
                )
              ) || (
                listingMeta.perspective == 'buyer' && (
                  (listingMeta.originalStatus == 'PENDING_BUYER_CONFIRMATION' && (
                    <View style={[GlobalStyles.flexRow]}>
                      <Button icon="check" title='Confirm' style={[{ marginRight: 12 }]} onPress={() => dispatchAction(buyerConfirm)} />
                      <Button icon="close" title='Decline' onPress={() => dispatchAction(buyerDecline)} />
                    </View>
                  )) 
                )
              )
            )}
          </View>
          }
          { isSubmitting && <View style={styles.listingActions}>
            <ActivityIndicator></ActivityIndicator>
          </View> 
          }
          { submitError }
        </View>

        { listingMeta && 
          <View style={styles.section}>
            <View style={[GlobalStyles.flexRow, { justifyContent: 'space-between', marginBottom: 16 }]}>
              { new Array(listingMeta.totalSteps).fill(0).map((_, idx) => idx + 1) .map((stepNumber, idx) => (
                <Animated.View key={stepNumber} style={[
                  styles.statusStep,
                  idx + 1 == listingMeta.totalSteps && { marginRight: 0 },
                  stepNumber < listingMeta.currentStep && styles.statusStepDone,
                  stepNumber == listingMeta.currentStep && styles.statusStepPending,
                  stepNumber == listingMeta.currentStep && { opacity: pendingAnim.values['opacity'] },
                  stepNumber > listingMeta.currentStep && styles.statusStepUpcoming,
                ]}>
                </Animated.View>
              ))}
            </View>
            <View>
              <Text style={styles.sectionHeader}>{listingMeta.shortStatus}</Text>
              <Text>{ listingMeta.longStatus }</Text>
            </View>
          </View> 
        }

        { listingMeta && (
          <AssetSection style={{ marginHorizontal: 16 }} assets={assets} setAssets={setAssets} autoPush={{ listingId: listing.id}} mode={ 
            listingMeta.perspective == 'buyer' ? AssetSectionMode.VIEW : (
              listingMeta.originalStatus == 'PENDING_SELLER_ACTION' ? AssetSectionMode.ADD : AssetSectionMode.VIEW
              )
          } />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Description</Text>
          <Text>{ listing.description }</Text>
        </View>


        <View style={[GlobalStyles.horizSectCt, { marginHorizontal: 16 }]}>
          <View style={[GlobalStyles.horizSect]}>
            <Text style={[GlobalStyles.horizSectText]}>Needs personalization</Text>
            <Text>{ listing.needsPersonalization ? 'Yes' : 'No' }</Text>
          </View>
          { listing.owner && (
            <View style={[GlobalStyles.horizSect]}>
              <Text style={[GlobalStyles.horizSectText]}>Sold by</Text>
              <Text>{ listing.owner.firstName } { listing.owner.lastName }</Text>
            </View>
          ) }
          <View style={[GlobalStyles.horizSect]}>
            <Text style={[GlobalStyles.horizSectText]}>Category</Text>
            <Text>{ listing.listingCategory.name }</Text>
          </View>
        </View>
      </SafeAreaView> 
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    
  },
  coverImage: {
    width: '100%',
    height: 230,
  },
  titleView: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
  },
  price: {
    fontSize: 22,
    marginTop: 8,
    fontWeight: '500',
    color: '#002F34'
  },
  listingActions: {
    marginTop: 12,
    flexDirection: 'row',
  },
  section: {
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    fontWeight: '500',
    marginBottom: 8,
  },
  tagSection: {
    flexDirection: 'row',
  },
  statusStep: {
    borderRadius: 6,
    height: 3,
    flex: 1,
    marginRight: 8,
  },
  statusStepDone: {
    backgroundColor: '#3f51b5',
  },
  statusStepPending: {
    backgroundColor: '#3f51b5',
  },
  statusStepUpcoming: {
    backgroundColor: '#e8eaf6',
  }
});
