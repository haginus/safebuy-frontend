import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListingCard } from '../../components/ListingCard';
import { OfflineComponent } from '../../components/OfflineComponent';
import { SearchBar } from '../../components/SearchBar';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { Listing } from '../../lib/model/Listing';
import { wait } from '../../lib/util';
import { searchListings } from '../../store/marketplaceSlice';
import { ListingStackScreenProps } from '../../types';

export default function ListingTabHome({ navigation }: ListingStackScreenProps<'ListingTabHome'>) {
  const [refreshing, setRefreshing] = useState(false);

  const searchListingsResult = useAppSelector(state => state.marketplace.searchListingsResult);
  const searchString = useAppSelector(state => state.marketplace.searchString);
  const searchCategory = useAppSelector(state => state.marketplace.searchSelectedCategory);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    onSearch();
  }, []);

  const onSearch = async () => {
    setRefreshing(true);
    const result = await dispatch(searchListings());
    setRefreshing(false);
    if(result.meta.requestStatus == 'rejected') {
      setError(true);
    }
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <SearchBar />
      <ScrollView style={styles.scrollView} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        { error && <OfflineComponent />}
        { searchListingsResult && searchListingsResult.map((listing, index) => 
          ( <ListingCard listing={listing} key={index} onPress={() => navigation.push('ListingDetails', { id: listing.id }) } />) ) }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: 100
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    width: '100%',
  },
});
