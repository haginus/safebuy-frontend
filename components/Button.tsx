import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

export type ButtonProps = {
  theme?: 'translucent' | 'solid_rounded';
  icon?: React.ComponentProps<typeof MaterialIcons>['name'] | React.ReactNode;
  title?: string;
  onPress?: () => void;
} & TouchableHighlight['props'];

export function Button(props: ButtonProps) {
  let { theme, icon, title, onPress, style, disabled, ...otherProps } = props;
  theme = theme || 'translucent';

  return (
    <TouchableHighlight 
      onPress={onPress} 
      style={[styles.highlight, styles['highlight_' + theme as 'highlight_translucent'], disabled && { opacity: 0.7}, style]} 
      disabled={disabled}
      {...otherProps}
    >
      <View style={[styles.button, styles['button_' + theme as 'button_translucent']]}>
        <View style={!!title && { marginRight: 8 }}>
          { typeof icon !== 'function' ? (
            <MaterialIcons name={icon as any} size={16} color="#0666eb"  />
          ) : (icon())
          }
        </View>
        <Text style={[styles.text, styles['text_' + theme as 'text_translucent']]}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  highlight: {
    borderRadius: 10,
  },
  highlight_translucent: {
    borderRadius: 10,
  },
  highlight_solid_rounded: {
    borderRadius: 16,
  },
  button: {
    paddingHorizontal: 16,
    height: 36,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  button_translucent: {
    backgroundColor: '#e6f0fd',
  },
  button_solid_rounded: {
    backgroundColor: '#0666eb',
    height: 48,
    borderRadius: 16,
    justifyContent: 'center'
  },
  text: {
    color: '#0666eb',
    fontWeight: '500'
  },
  text_translucent: {
    color: '#0666eb',
    fontWeight: '500'
  },
  text_solid_rounded: {
    color: '#fff',
    fontWeight: '500'
  }
});