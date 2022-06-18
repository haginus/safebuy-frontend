import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListingCard } from '../components/ListingCard';

import { ScrollView, Text } from '../components/Themed';
import { useGlobalStyles } from '../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { fetchMyListings } from '../store/marketplaceSlice';
import { RootTabScreenProps } from '../types';

export default function MyListingsScreen({ navigation }: RootTabScreenProps<'MyListingsTab'>) {

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[GlobalStyles.header1]}>My Listings</Text>
          <TouchableOpacity onPress={ () => navigation.push('Listing', { screen: 'ListingEdit', params: {} })}>
            <MaterialIcons name="add" size={28}></MaterialIcons>
          </TouchableOpacity>
        </View>
        
        {myListings.map((listing, index) => (
          <ListingCard 
            listing={listing} 
            key={index} 
            onPress={() => navigation.push('Listing', { screen: 'ListingDetails', params: { id: listing.id } })}/>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
