import {View, Text} from 'react-native';
import React from 'react';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Colors, NavigationRoutes} from '@/Constants';
import {Login, OTP} from 'Auth';

type AuthStackParamList = {
  LOGIN: undefined;
  OTP: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export type LOGINPageProps = NativeStackScreenProps<
  AuthStackParamList,
  'LOGIN'
>;
export type OTPPageProps = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
      }}>
      <Stack.Screen name={'LOGIN'} component={Login} />
      <Stack.Screen name={'OTP'} component={OTP} />
    </Stack.Navigator>
  );
};

export default AuthStack;
