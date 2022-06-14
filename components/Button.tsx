import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

export type ButtonProps = {
  theme?: 'translucent';
  icon?: React.ComponentProps<typeof MaterialIcons>['name'] | React.ReactNode;
  title?: string;
  onPress?: () => void;
} & TouchableHighlight['props'];

export function Button(props: ButtonProps) {
  let { theme, icon, title, onPress, style, ...otherProps } = props;
  theme = theme || 'translucent';

  return (
    <TouchableHighlight onPress={onPress} style={[styles.highlight, style]} {...otherProps}>
      <View style={[styles.button]}>
        <View style={!!title && { marginRight: 8 }}>
          { typeof icon !== 'function' ? (
            <MaterialIcons name={icon as any} size={16} color="#0666eb"  />
          ) : (icon())
          }
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  highlight: {
    borderRadius: 10,
  },
  button: {
    paddingHorizontal: 16,
    backgroundColor: '#e6f0fd',
    height: 36,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  text: {
    color: '#0666eb',
    fontWeight: '500'
  }
});