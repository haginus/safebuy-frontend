import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArialText } from '../../components/StyledText';
import { Tag } from '../../components/Tag';
import { Text, View, ScrollView } from '../../components/Themed';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

import { Listing } from '../../lib/model/Listing';
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
    <ScrollView style={styles.scrollView}>
      <Image
        style={styles.coverImage}
        source={require("../../assets/images/icon.png")}
      />
      <View style={styles.titleView}>
        <Text style={styles.title}>{listing.title}</Text>
        <ArialText style={[styles.price, { color: Colors[colorScheme].tint }]}>{listing.price} lei</ArialText>
      </View>

      <View style={[styles.section, styles.tagSection]}>
        <Tag text="Needs personalization" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Description</Text>
        <Text>{ listing.description }</Text>
      </View>
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
    paddingBottom: 22,
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
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionHeader: {
    fontWeight: '500',
    marginBottom: 8,
  },
  tagSection: {
    flexDirection: 'row',
  }
});
