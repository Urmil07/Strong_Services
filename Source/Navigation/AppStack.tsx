import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '@/Constants';
import {ColdList, Home, LedgerScreen, OSListFilter, OSListScreen} from 'App';
import OSData from '@/Screens/App/OutStanding/OSData';
import {AppStackParamList} from '@/Interfaces/AppStackParamList';
import LedgerDetailScreen from '@/Screens/App/Ledger/LedgerDetailScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
        orientation: 'portrait',
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name={'Home'} component={Home} />
      <Stack.Screen name={'OSListScreen'} component={OSListScreen} />
      <Stack.Screen name="OSData" component={OSData} />
      <Stack.Screen name={'OSListFilter'} component={OSListFilter} />
      <Stack.Screen name={'LedgerScreen'} component={LedgerScreen} />
      <Stack.Screen
        name={'LedgerDetailScreen'}
        component={LedgerDetailScreen}
      />
      <Stack.Screen name={'ColdList'} component={ColdList} />
    </Stack.Navigator>
  );
};

export default AppStack;
