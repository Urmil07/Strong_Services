import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors, NavigationRoutes} from '@/Constants';
import {Home, OSListScreen} from 'App';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
      }}>
      <Stack.Screen name={NavigationRoutes.HOME} component={Home} />
      <Stack.Screen name={NavigationRoutes.OSList} component={OSListScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
