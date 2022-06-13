import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ArialText } from '../../components/StyledText';
import { Tag } from '../../components/Tag';
import { Text, View, ScrollView } from '../../components/Themed';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

import { Listing } from '../../lib/model/Listing';
import { formatPrice } from '../../lib/util';
import { ListingStackScreenProps, RootTabScreenProps } from '../../types';

export default function ListingDetailsScreen({ navigation, route }: ListingStackScreenProps<'ListingDetails'>) {
  const { id: listingId } = route.params;
  const colorScheme = useColorScheme();
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
    "price": 550.10,
    "owner": {
      "id": 1,
      "firstName": "Andrei",
      "lastName": "Hagi",
      "birthDate": "1999-08-08",
      "email": "hagiandrei.ah@gmail.com"
    }
  }
  return (
    <ScrollView style={styles.scrollView}>
      <Image
        style={styles.coverImage}
        source={require("../../assets/images/icon.png")}
      />
      <View style={styles.titleView}>
        <Text style={styles.title}>{listing.title}</Text>
        <ArialText style={[styles.price, { color: Colors[colorScheme].tint }]}>
          {formatPrice(listing.price)}
        </ArialText>
        <View style={styles.listingActions}>
          <Button icon="shopping-basket" title='Buy'  />
          <Button icon="edit" title='Edit' />
        </View>
      </View>

      <View style={[styles.section, styles.tagSection]}>
        <Tag text="Needs personalization" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Description</Text>
        <Text>{ listing.description }</Text>
      </View>

      { listing.owner && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sold by</Text>
          <Text>{ listing.owner.firstName } { listing.owner.lastName }</Text>
        </View>
      ) }
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
    marginTop: 16,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  sectionHeader: {
    fontWeight: '500',
    marginBottom: 8,
  },
  tagSection: {
    flexDirection: 'row',
  }
});
