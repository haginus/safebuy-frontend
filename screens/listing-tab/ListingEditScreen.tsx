import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActionSheetIOS, ActivityIndicator, Alert, StyleSheet, Switch, TouchableHighlight, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FieldTextInput } from '../../components/StyledTextInput';

import { ScrollView, Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useGlobalStyles } from '../../constants/GlobalStyles';
import useColorScheme from '../../hooks/useColorScheme';
import { Asset } from '../../lib/model/Asset';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker'
import * as FileSystem from 'expo-file-system';
import { Button } from '../../components/Button';
import { Listing, ListingCreate } from '../../lib/model/Listing';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { createListing, selectListing, updateListing } from '../../store/marketplaceSlice';
import { parseError } from '../../components/ErrorMessage';
import AssetSection from '../../components/AssetSection';
import { ListingStackScreenProps } from '../../types';

interface FormValue {
  title: string;
  description: string;
  price: string;
  needsPersonalization: boolean;
}

export default function ListingEditScreen({ navigation, route }: ListingStackScreenProps<'ListingEdit'>) {

  const { control, handleSubmit, setValue, formState: { errors, isValid: isFormValid } } = useForm<FormValue>({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      needsPersonalization: true
    },
    mode: 'onChange',
  });

  const mode = route.params?.id ? 'edit' : 'add';

  const [assets, setAssets] = useState<Asset[]>([]);
  const user = useAppSelector(state => state.user.currentUser);
  const existingListing = useAppSelector(state => selectListing(state, Number(route.params?.id)));

  const isValid = isFormValid && assets.length > 0;
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(mode == 'add') return;
    setValue('title', existingListing.title);
    setValue('description', existingListing.description);
    setValue('price', '' + existingListing.price);
    setValue('needsPersonalization', existingListing.needsPersonalization);
    setAssets(existingListing.assets);
  }, []);

  const onSubmit = async (data: FormValue) => {
    if(!isValid || isLoading) return;
    const listing: ListingCreate = {
      ...data,
      price: parseFloat(data.price),
      assets,
      listingCategoryId: 1,
      ownerId: user?.id as number,
    }
    setIsLoading(true);

    const result = await (mode == 'add' ? dispatch(createListing(listing)) : dispatch(updateListing({...listing, id: existingListing.id })));
    if(result.meta.requestStatus == 'rejected') {
      setIsLoading(false);
      parseError(result, setSubmitError);
    } else {
      setIsLoading(false);
      if(mode == 'add') {
        navigation.replace('Root');
      } else {
        navigation.goBack();
      }
    }
  };

  const GlobalStyles = useGlobalStyles();

  return (
      <ScrollView style={[GlobalStyles.container]} contentContainerStyle={[styles.scrollView]}>
        <Text style={[GlobalStyles.header1]}>
          { mode == 'add' ? 'New listing' : 'Edit listing' }
        </Text>
        { submitError }
        <Controller
          control={control}
          name="title"
          rules={{
          required: true,
          }}
          render={({ field }) => (
            <FieldTextInput
              label="Title"
              error={errors.title ? 'This field is required.' : null }
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          rules={{
            maxLength: 1024
          }}
          render={({ field }) => (
            <FieldTextInput
              label="Description (optional)"
              multiline={true}
              hint={`${field.value.length} / 1024`}
              style={{ minHeight: 96, maxHeight: 96 }}
              error={errors.description ? 'Max 1024 characters.' : null }
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          rules={{
            min: 20,
            required: true
          }}
          render={({ field }) => (
            <FieldTextInput
              label="Price"
              placeholder='At least 20 RON'
              error={errors.price ? 'Price must be at least 20 RON.' : null }
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              keyboardType='numeric'
            />
          )}
        />
        <View style={[GlobalStyles.horizSectCt]}>
          <View style={[GlobalStyles.horizSect]}>
            <Text style={[GlobalStyles.horizSectText]}>Needs personalization</Text>
            <Controller
              control={control}
              name="needsPersonalization"
              rules={{
              }}
              render={({ field }) => (
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={field.value ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </View>
          <View style={[GlobalStyles.horizSect]}>
            <Text>Category</Text>
            <Text>Tickets</Text>
          </View>
        </View>
        
        <AssetSection assets={assets} setAssets={setAssets} mode={2} />
        <Text style={[GlobalStyles.explanatory, { marginTop: -8, marginBottom: 24 }]}>
          Assets are only seen after someone has purchased your listing.
        </Text>
        <Button 
          title={isLoading ? '' : 'Publish'} 
          theme='solid_rounded' 
          icon={() => isLoading && <ActivityIndicator color='#fff'/>}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          style={{ marginBottom: 36 }}
        ></Button>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 72,
  }
});



