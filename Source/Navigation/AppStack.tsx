import {
  ColdList,
  Home,
  LedgerFilter,
  LedgerScreen,
  LedgerSummaryScreen,
  OSListFilter,
  OSListScreen,
} from 'App';

import {AppStackParamList} from '@/Interfaces/AppStackParamList';
import {Colors} from '@/Constants';
import LedgerDetailScreen from '@/Screens/App/Ledger/LedgerDetailScreen';
import OSData from '@/Screens/App/OutStanding/OSData';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
      <Stack.Screen
        name={'LedgerSummaryScreen'}
        component={LedgerSummaryScreen}
      />
      <Stack.Screen name={'LedgerScreen'} component={LedgerScreen} />
      <Stack.Screen
        name={'LedgerDetailScreen'}
        component={LedgerDetailScreen}
      />
      <Stack.Screen name={'ColdList'} component={ColdList} />
      <Stack.Screen name={'LedgerFilter'} component={LedgerFilter} />
    </Stack.Navigator>
  );
};

export default AppStack;
