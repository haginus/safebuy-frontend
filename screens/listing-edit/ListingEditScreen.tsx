import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
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
import { createListing } from '../../store/marketplaceSlice';
import { parseError } from '../../components/ErrorMessage';

interface FormValue {
  title: string;
  description: string;
  price: string;
  needsPersonalization: boolean;
}

export default function ListingEditScreen({ navigation }: { navigation: any }) {

  const { control, handleSubmit, formState: { errors, isValid: isFormValid } } = useForm<FormValue>({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      needsPersonalization: true
    },
    mode: 'onChange',
  });

  const [assets, setAssets] = useState<Asset[]>([]);
  const user = useAppSelector(state => state.user.currentUser);

  const isValid = isFormValid && assets.length > 0;
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const dispatch = useAppDispatch();

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
    const result = await dispatch(createListing(listing));
    if(result.meta.requestStatus == 'rejected') {
      setIsLoading(false);
      parseError(result, setSubmitError);
    } else {
      setIsLoading(false);
      // navigation
    }
  };

  const onAssetAdd = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Link", "File"],
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          linkAdd();
        } else if (buttonIndex === 2) {
          fileAdd();
        }
      }
    );
  }

  const linkAdd = () => {
    Alert.prompt('Link', 'Enter the link', (link) => {
      const re = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gm;
      if(re.test(link)) {
        setAssets([...assets, { type: 'link', link }]);
      } else {
        Alert.alert('Invalid link');
      }
    });
  }

  const fileAdd = async () => {
    let pickedFile: DocumentPickerResponse;
    try {
      pickedFile = (await DocumentPicker.pick())[0];
    } catch (err)  {
      return;
    }
    
    let content = await FileSystem.readAsStringAsync(pickedFile.uri, { 
      encoding: FileSystem.EncodingType.Base64 
    });
    content = `data:${pickedFile.type};base64,` + content;
    const asset: Asset = { type: 'file', name: pickedFile.name, mimeType: pickedFile.type as string, content };
    setAssets([...assets, asset]);
  };

  const onAssetClick = (asset: Asset) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ["Cancel", "Remove"],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        setAssets(assets.filter(a => a !== asset));
      }
    });
  }

  const GlobalStyles = useGlobalStyles();

  return (
    <ScrollView style={GlobalStyles.container}>
      <SafeAreaView edges={['bottom']}>
        <Text style={[GlobalStyles.header1]}>
          New listing
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
        
        <View style={[GlobalStyles.horizSectHeader]}>
          <Text>Assets</Text>
          <TouchableOpacity onPress={onAssetAdd}>
            <Text style={[GlobalStyles.textAction]}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={[GlobalStyles.horizSectCt]}>
          {assets.map((asset, index) => (
            <AssetItem asset={asset} key={index} onPress={() => onAssetClick(asset)} />
          ))}
          {assets.length === 0 && (
            <View style={[GlobalStyles.horizSect, { justifyContent: 'center' }]}>
              <Text>Please provide at least one asset.</Text>
            </View>
          )}
        </View>
        <Text style={[GlobalStyles.explanatory, { marginTop: -8, marginBottom: 24 }]}>
          Assets are only seen after someone has purchased your listing.
        </Text>
        <Button 
          title={isLoading ? '' : 'Publish'} 
          theme='solid_rounded' 
          icon={() => isLoading && <ActivityIndicator color='#fff'/>}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
        ></Button>
      </SafeAreaView>
    </ScrollView>
  );
}

function AssetItem({ asset, onPress }: { asset: Asset, onPress: () => any }) {

  const assetTitle = asset.type == 'link' ? asset.link : asset.name; 
  const icon = asset.type == 'link' ? 'link' : 'description';

  const GlobalStyles = useGlobalStyles();
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 56,
      justifyContent: 'flex-start',
    },
    circle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
    },
    title: {
      overflow: 'hidden',
    }
  });
  return (
    <TouchableHighlight style={{ borderRadius: 8 }} onPress={onPress}>
      <View style={[GlobalStyles.horizSect, styles.container]}>
        <View style={[styles.circle, { backgroundColor: Colors[colorScheme].background2 }]}>
          <MaterialIcons name={icon} size={24} color={Colors[colorScheme].tint} />
        </View>
        <Text numberOfLines={1} style={{ flex: 1 }}>{assetTitle}</Text>
      </View>
    </TouchableHighlight>
  );
}


