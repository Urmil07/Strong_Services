import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {Colors} from '@/Constants';
import {Login} from 'Auth';
import React from 'react';

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
    </Stack.Navigator>
  );
};

export default AuthStack;
