import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Platform, StyleSheet } from 'react-native';
import { FieldTextInput } from '../../components/StyledTextInput';

import { Text, View } from '../../components/Themed';
import { AuthContext } from '../../context/AuthContext';
import { Service } from '../../lib/constants';
import { AuthResponse } from '../../lib/model/AuthResponse';
import { apiCall } from '../../lib/util';

interface FormValue {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignInScreen() {
  const { signIn } = useContext(AuthContext);

  const { control, handleSubmit, getValues, formState: { errors, isValid } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
  }
  });
  

  const onSubmit = async (data: FormValue) => {
    try {
      const registerData = {...data, birthDate: "1971-01-01" };
      const result = await apiCall<AuthResponse>(Service.USER, "/auth/sign-up", "POST", registerData);
      signIn(result);
      console.log(result)
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Safebuy!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field }) => (
          <FieldTextInput
            label="First name"
            error={errors.firstName ? 'This field is required.' : null }
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        name="firstName"
      />
      <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field }) => (
          <FieldTextInput
            label="Last name"
            error={errors.lastName ? 'This field is required.' : null }
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        name="lastName"
      />
      <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field }) => (
          <FieldTextInput
            label="Email"
            error={errors.email ? 'This field is required.' : null }
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
         required: true,
         minLength: 6
        }}
        render={({ field }) => (
          <FieldTextInput
            label="Password"
            error={errors.password ? 'Password length must be at least 6 characters.' : null }
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
            secureTextEntry
          />
        )}
        name="password"
      />
       <Controller
        control={control}
        rules={{
         required: true,

        }}
        render={({ field }) => (
          <FieldTextInput
            label="Confirm password"
            error={errors.password ? "Passwords don't match." : null }
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
            secureTextEntry
          />
        )}
        name="confirmPassword"
      />

      <Button title="Sign up" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
