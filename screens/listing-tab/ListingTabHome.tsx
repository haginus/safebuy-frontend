import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListingCard } from '../../components/ListingCard';
import { SearchBar } from '../../components/SearchBar';
import { Listing } from '../../lib/model/Listing';
import { ListingStackScreenProps } from '../../types';

export default function ListingTabHome({ navigation }: ListingStackScreenProps<'ListingTabHome'>) {
  const listing: Listing = {
    "id": 1,
    "title": "Abonament SAGA GA",
    "description": "Un bilet la un festival foarte NAȘPA.",
    "needsPersonalization": true,
    "listingCategory": {
      "id": 1,
      "name": "Tickets",
      "icon": "ticket"
    },
    "ownerId": 1,
    "price": 550.0,
    "owner": {
      "id": 1,
      "firstName": "Andrei",
      "lastName": "Hagi",
      "birthDate": "1999-08-08",
      "email": "hagiandrei.ah@gmail.com"
    }
  }
  return (

    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      {/* <View style={styles.searchBar} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <SearchBar />
      <ScrollView style={styles.scrollView}>
        { Array.from({ length: 15 }).map((_, index) => 
          ( <ListingCard listing={listing} key={index} onPress={() => navigation.push('ListingDetails', { id: 1 }) } />) ) }
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
