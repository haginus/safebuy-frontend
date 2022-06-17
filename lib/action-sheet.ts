import { ActionSheetIOS } from "react-native";

interface ActionSheetOption {
  title: string;
  onPress?: () => any;
  isCancel?: boolean;
  isDistructive?: boolean;
}

export function openActionSheet(_options: (ActionSheetOption | null | false)[]) {
  const options = _options.filter(option => !!option) as ActionSheetOption[];
  const buttons = options.map(option => option.title);
  const cancelButtonIndex = options.findIndex(option => option.isCancel);
  const destructiveButtonIndex = options.findIndex(option => option.isDistructive);
  ActionSheetIOS.showActionSheetWithOptions({
    options: buttons,
    cancelButtonIndex: cancelButtonIndex >= 0 ? cancelButtonIndex : undefined,
    destructiveButtonIndex: destructiveButtonIndex >= 0 ? destructiveButtonIndex : undefined,
  }, index => {
    if (index >= 0 && options[index].onPress) {
      (options[index] as any).onPress();
    }
  });
}