import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListingCard } from '../../components/ListingCard';
import { OfflineComponent } from '../../components/OfflineComponent';
import { SearchBar } from '../../components/SearchBar';
import { Text } from '../../components/Themed';
import { useGlobalStyles } from '../../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { searchListings } from '../../store/marketplaceSlice';
import { RootTabScreenProps } from '../../types';

export default function SearchListingsTab({ navigation }: RootTabScreenProps<'SearchListingsTab'>) {
  const [refreshing, setRefreshing] = useState(false);

  const searchListingsResult = useAppSelector(state => state.marketplace.searchListingsResult);
  const searchString = useAppSelector(state => state.marketplace.searchString);
  const searchCategory = useAppSelector(state => state.marketplace.searchSelectedCategory);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);

  const onSearch = async () => {
    setRefreshing(true);
    const result = await dispatch(searchListings());
    setRefreshing(false);
    if(result.meta.requestStatus == 'rejected') {
      setError(true);
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    onSearch();
  }, [searchString, searchCategory]);

  useEffect(() => {
    onSearch();
  }, []);


  const GlobalStyles = useGlobalStyles();
  return (
    <ScrollView style={GlobalStyles.container} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onSearch}
        />
      }
    >
      <SafeAreaView>
        <Text style={GlobalStyles.header1}>Listings</Text>
        <SearchBar />
        { error && <OfflineComponent />}
        { searchListingsResult && searchListingsResult.map((listing, index) => ( 
          <ListingCard 
            listing={listing} 
            key={index} 
            onPress={() => navigation.push('Listing', { screen: 'ListingDetails', params: { id: 1 } }) } 
          />) 
        ) }
      </SafeAreaView>
    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
});
