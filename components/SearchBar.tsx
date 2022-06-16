import { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import useColorScheme from "../hooks/useColorScheme";
import { ListingCategory } from "../lib/model/ListingCategory";
import { fetchListingCategories, setSearchString, setSelectedCategory } from "../store/marketplaceSlice";
import { AnimationAB } from "../lib/util";
import { CircleIcon } from "./ListingCategoryIcon";
import { ArialText } from "./StyledText";
import { Text, TextInput } from "./Themed";
import debounce from "debounce";

export function SearchBar() {
  const colorScheme = useColorScheme();
  const listingCategories = useAppSelector(state => state.marketplace.listingCategories);
  const selectedCategory = useAppSelector(state => state.marketplace.searchSelectedCategory);
  const searchString = useAppSelector(state => state.marketplace.searchString);
  const dispatch = useAppDispatch();
  const [filtersToggled, setFiltersToggled] = useState(false);

  const [searchStringInternal, setSearchStringInternal] = useState("");

  const onSearchStringChange = useRef(debounce((value: string) => {
    dispatch(setSearchString(value));
  }, 400)).current;

  useEffect(()=> {
    setSearchStringInternal(searchString);
    dispatch(fetchListingCategories());
  }, [])

  const toggleAnim = useRef(
    new AnimationAB({
      containerPadding: { from: 0, to: 12 },
      containerHeight: { from: 40, to: 140 },
      containerBg: { from: 0, to: 1 },
      firstRowPadding: { from: 0, to: 12 },
    }, { duration: 200 })
  ).current;

  const containerColor = toggleAnim.values['containerBg'].interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
  });

  const toggleFilters = () => {
    if(!filtersToggled) {
      toggleAnim.toB();
    } else {
      toggleAnim.toA();
    }
    setFiltersToggled(!filtersToggled);
  }

  const selectCategory = (category: ListingCategory) => {
    if(category.id == selectedCategory?.id) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(category));
    }
  }

  return (
    <Animated.View
      style={[
        styles.container, 
        { 
          backgroundColor: containerColor,
          paddingVertical: toggleAnim.values['containerPadding'],
          height: toggleAnim.values['containerHeight'],
        }
      ]}>
      <Animated.View style={[styles.firstRowContainer, { paddingHorizontal: toggleAnim.values['firstRowPadding'] }]}>
        <TextInput 
          style={styles.searchBar} 
          lightBackgroundColor="#ddd"
          darkBackgroundColor="#222"
          placeholder="Search..."
          autoCapitalize="none"
          autoCorrect={false}
          value={searchStringInternal}
          onChangeText={(value) => { 
            setSearchStringInternal(value);
            onSearchStringChange(value);
          }}
        />
        <TouchableOpacity onPress={toggleFilters}>
          <CircleIcon icon="filter-list" active={!!selectedCategory || filtersToggled} />
        </TouchableOpacity>
      </Animated.View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={[styles.cartegoryRow]}>
        {listingCategories.map((category, index) => (
          <TouchableOpacity onPress={() => selectCategory(category)} key={index} activeOpacity={0.8}>
            <View style={styles.category}>
              <CircleIcon icon={category.icon} size={48} active={selectedCategory?.id == category.id} />
              <ArialText style={styles.categoryText}>{category.name}</ArialText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 8,
  },
  firstRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginRight: 8
  },
  cartegoryRow: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
  category: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12
  }
});