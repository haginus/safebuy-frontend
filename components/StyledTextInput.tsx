import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, TextInputProps, View } from './Themed';

export interface FieldTextInputProps extends TextInputProps {
  label: string;
  hint?: string | null;
  error?: string | null;
}

export const FieldTextInput = forwardRef<any, FieldTextInputProps>((props, ref) => {
  const { label, hint, error, ...inputProps } = props;
  
  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <TextInput {...inputProps} ref={ref} style={[styles.field, ...(error ? [styles.fieldError] : []), props.style]} />
      <Text style={[styles.hint, ...(error ? [styles.errorHint] : [])]} numberOfLines={1}>{error || hint}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  label: {
    marginBottom: 6,
    fontWeight: '300',
  },
  hint: {
    color: '#aaa',
    marginTop: 6,
    fontWeight: '500',
  },
  errorHint: {
    color: '#c62828',
  },
  field: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '100%',
  },
  fieldError: {
    borderColor: '#c62828',
  }
});
