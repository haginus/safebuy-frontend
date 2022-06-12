import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { FieldTextInput } from '../../components/StyledTextInput';

import { Text, TextInput, View } from '../../components/Themed';
import { AuthContext } from '../../context/AuthContext';
import { Service, USER_API_URL } from '../../lib/constants';
import { AuthResponse } from '../../lib/model/AuthResponse';
import { apiCall } from '../../lib/util';
import { AuthStackScreenProps } from '../../types';

interface FormValue {
  email: string;
  password: string;
}

export default function SignInScreen({ navigation }: AuthStackScreenProps<'SignIn'>) {
  const { signIn } = useContext(AuthContext);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit = async (data: FormValue) => {
    try {
      const result = await apiCall<AuthResponse>(Service.USER, "/auth/sign-in", "POST", data);
      signIn(result);
    } catch (error) {
      
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
        }}
        render={({ field }) => (
          <FieldTextInput
            label="Password"
            error={errors.password ? 'This field is required.' : null }
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
            secureTextEntry
          />
        )}
        name="password"
      />

      <Button title="Sign in" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity onPress={() => navigation.push('SignUp')} style={styles.link}>
        <Text>No account? Click here to sign up!</Text>
      </TouchableOpacity>
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
  link: {
    marginTop: 8,
  },
});
