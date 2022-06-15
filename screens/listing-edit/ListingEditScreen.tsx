import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActionSheetIOS, Alert, StyleSheet, Switch, TouchableHighlight, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FieldTextInput } from '../../components/StyledTextInput';

import { ScrollView, Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useGlobalStyles } from '../../constants/GlobalStyles';
import useColorScheme from '../../hooks/useColorScheme';
import { Asset } from '../../lib/model/Asset';
import DocumentPicker, {
  
} from 'react-native-document-picker'
import { launchImageLibrary } from 'react-native-image-picker';

interface FormValue {
  title: string;
  description: string;
  price: string;
  needsPersonalization: boolean;

}

export default function ListingEditScreen() {

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValue>({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      needsPersonalization: true
    }
  });

  const [assets, setAssets] = useState<Asset[]>([
    {type: 'link', link: 'https://google.ro/safety-measures/click-here-kk'}
  ]);

  const onAssetAdd = () =>
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
      const result = await DocumentPicker.pick({
        mode: 'open',
        copyTo: 'cachesDirectory',
        type: DocumentPicker.types.allFiles,
      });
      // const result = await launchImageLibrary({ mediaType: 'photo' });
      console.log(result)

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
              keyboardType='numeric'
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
            min: 20
          }}
          render={({ field }) => (
            <FieldTextInput
              label="Price"
              placeholder='At least 20 RON'
              error={errors.title ? 'Price is at least 20 RON.' : null }
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
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
                maxLength: 1024
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
            <Text>categ</Text>
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
        </View>
        <Text style={[GlobalStyles.explanatory, { marginTop: -8 }]}>
          Assets are only seen after someone has purchased your listing.
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
}

function AssetItem({ asset, onPress }: { asset: Asset, onPress: () => any }) {

  const assetTitle = asset.type == 'link' ? asset.link : asset.name; 

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
          <MaterialIcons name="link" size={24} color={Colors[colorScheme].tint} />
        </View>
        <Text numberOfLines={1} style={{ flex: 1 }}>{assetTitle}</Text>
      </View>
    </TouchableHighlight>
  );
}


