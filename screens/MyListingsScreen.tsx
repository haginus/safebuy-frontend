import { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListingCard } from '../components/ListingCard';

import { ScrollView, Text, View } from '../components/Themed';
import { useGlobalStyles } from '../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { fetchMyListings } from '../store/marketplaceSlice';

export default function MyListingsScreen() {

  const myListings = useAppSelector(state => state.marketplace.myListings);
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMyListings());
    // Check errors
    setRefreshing(false);
  };

  const GlobalStyles = useGlobalStyles();
  return (
    <ScrollView style={GlobalStyles.container} refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      <SafeAreaView>
        <Text style={[GlobalStyles.header1]}>My Listings</Text>
        {myListings.map((listing, index) => (
          <ListingCard listing={listing} key={index}/>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
