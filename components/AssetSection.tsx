import { MaterialIcons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ActionSheetIOS, ActivityIndicator, Alert, Linking, Platform, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { useGlobalStyles } from "../constants/GlobalStyles";
import useColorScheme from "../hooks/useColorScheme";
import { Asset } from "../lib/model/Asset";
import { Text, View as ThemedView } from "./Themed";
import * as FileSystem from 'expo-file-system';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker'
import RNFetchBlob from "rn-fetch-blob";
import { MARKETPLACE_API_URL } from "../lib/constants";
import { openActionSheet } from "../lib/action-sheet";

export enum AssetSectionMode {
  VIEW = 0,
  ADD = 1,
  EDIT = 2,
}


type AssetSectionProps = {
  assets: Asset[];
  setAssets: Dispatch<SetStateAction<Asset[]>>;
  mode: AssetSectionMode;
  autoPush?: boolean;
} & View["props"];

interface AssetMap {
  [key: string]: {
    isLoading: boolean;
    error: string | null;
  };
}

const indexAsset = (asset: Asset) => {
  if(asset.type == 'link') {
    return asset.link;
  }
  return asset.name;
}

export default function AssetSection({ assets: assets, setAssets, mode, autoPush, style, ...props }: AssetSectionProps) {

  const [assetMap, setAssetMap] = useState<AssetMap>({});
  const anyLoading = useMemo(() => Object.values(assetMap).some(({ isLoading }) => isLoading), [assetMap]);

  const onAssetAdd = () => {
    openActionSheet([
      { title: 'Cancel', isCancel: true },
      { title: 'Link', onPress: linkAdd },
      { title: 'File', onPress: fileAdd }
    ]);
  }

  const linkAdd = () => {
    Alert.prompt('Link', 'Enter the link', (link) => {
      const re = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gm;
      if(re.test(link)) {
        onAssetGenerated({ type: 'link', link });
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
    onAssetGenerated(asset);
  };

  const onAssetGenerated = (asset: Asset) => {
    if(!!autoPush) {
      // TODO: push to server

    } else {
      setAssets([...assets, asset]);
    }
  }

  const onAssetClick = (asset: Asset) => {
    if(anyLoading) return;

    const viewAsset = async () => {
      if (asset.type === 'link') {
        Linking.openURL(asset.link);
      } else if(asset.type == 'file') {
        const idx = indexAsset(asset);
        setAssetMap({ ...assetMap, [idx]: { isLoading: true, error: null } });
        try {
          const fs = RNFetchBlob.fs;
          let path: string;
          if(!asset.id) {
            // fresh file
            path = fs.dirs.CacheDir + `/${asset.name}`;
            const content = asset.content.replace(/^data:.+;base64,/, '');
            await fs.writeFile(path, content, 'base64');
          } else {
            const ext = asset.mimeType.split('/')[1];
            path = fs.dirs.DocumentDir + `/${asset.id}.${ext}`;
            const fileInMemery = await fs.exists(path);
            if(!fileInMemery) {
              await RNFetchBlob.config({ path })
                .fetch('GET', `${MARKETPLACE_API_URL}/assets/${asset.id}/content`);
            }
          }
          if(Platform.OS == 'ios') {
            RNFetchBlob.ios.openDocument(path);
          } else if(Platform.OS == 'android') {
            RNFetchBlob.android.actionViewIntent(path, asset.mimeType);
          }
          // Leave time for the OS to open the activity
          setTimeout(() => {
            setAssetMap({ ...assetMap, [idx]: { isLoading: false, error: null } });
          }, 2000);
        } catch (err) { 
          setAssetMap({ ...assetMap, [idx]: { isLoading: false, error: "Could not fetch file." } });
        }
      }
    };

    const removeAsset = () => setAssets(assets.filter(a => a !== asset));

    if(mode === AssetSectionMode.VIEW) {
      return viewAsset();
    }

    openActionSheet([
      { title: 'Cancel', isCancel: true },
      { title: 'View', onPress: viewAsset },
      mode === AssetSectionMode.EDIT && { title: 'Remove', isDistructive: true, onPress: removeAsset }
    ]);
  }

  const GlobalStyles = useGlobalStyles();

  return (
    <View {...props} style={[style]}>
      <View style={[GlobalStyles.horizSectHeader]}>
        <Text>Assets</Text>
        { mode > AssetSectionMode.VIEW && <TouchableOpacity onPress={onAssetAdd}>
          <Text style={[GlobalStyles.textAction]}>Add</Text>
        </TouchableOpacity>
        }
      </View>
      <ThemedView style={[GlobalStyles.horizSectCt]}>
        {assets.map((asset, index) => (
          <AssetItem asset={asset} key={index} assetMap={assetMap}  onPress={() => onAssetClick(asset)} />
        ))}
        {assets.length === 0 && (
          <View style={[GlobalStyles.horizSect, { justifyContent: 'center' }]}>
            <Text>Please provide at least one asset.</Text>
          </View>
        )}
      </ThemedView>
    </View>
  )
}

function AssetItem({ asset, assetMap, onPress }: { asset: Asset, assetMap: AssetMap, onPress: () => any }) {

  const assetTitle = asset.type == 'link' ? asset.link : asset.name; 
  const icon = asset.type == 'link' ? 'link' : 'description';
  const idx = indexAsset(asset);
  const isLoading = assetMap[idx]?.isLoading;
  const error = assetMap[idx]?.error;

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
      <ThemedView style={[GlobalStyles.horizSect, styles.container]}>
        <View style={[styles.circle, { backgroundColor: Colors[colorScheme].background2 }]}>
          { isLoading ? <ActivityIndicator/> : <MaterialIcons name={icon} size={24} color={Colors[colorScheme].tint} /> }
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1}>{assetTitle}</Text>
          {!!error && <Text style={{ color: Colors[colorScheme].errorText, marginTop: 4 }}>{error}</Text>}
        </View>
      </ThemedView>
    </TouchableHighlight>
  );
}