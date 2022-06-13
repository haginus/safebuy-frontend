import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';

import { Listing } from '../../lib/model/Listing';
import { ListingStackScreenProps, RootTabScreenProps } from '../../types';

export default function ListingDetailsScreen({ navigation, route }: ListingStackScreenProps<'ListingDetails'>) {
  const { id: listingId } = route.params;
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
    <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
      <ScrollView style={styles.scrollView}>
        <Text>{listingId}</Text>
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
