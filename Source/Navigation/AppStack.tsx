import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors, NavigationRoutes} from '@/Constants';
import {Home, OSListScreen} from 'App';
import OSData from '@/Screens/App/OutStanding/OSData';

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
      <Stack.Screen name="OSData" component={OSData} />
    </Stack.Navigator>
  );
};

export default AppStack;
