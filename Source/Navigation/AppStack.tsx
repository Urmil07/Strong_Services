import {
  ChangePassword,
  ColdList,
  Home,
  LedgerFilter,
  LedgerScreen,
  LedgerSummaryScreen,
  OSListFilter,
  OSListScreen,
  OrderConfig,
  SaleHome,
  StockSummDetail,
  StockSummFilter,
  StockSummList,
  TakeOrder,
  UserList,
  UserPrivileges,
} from 'App';
import {Colors, FontFamily, FontSize} from '@/Constants';

import {AppStackParamList} from '@/Interfaces/AppStackParamList';
import LedgerDetailScreen from '@/Screens/App/Ledger/LedgerDetailScreen';
import OSData from '@/Screens/App/OutStanding/OSData';
import {RNCDrawerView} from 'Common';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<AppStackParamList>();

const Drawer = createDrawerNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {backgroundColor: Colors.header},
        headerTintColor: Colors.WText,
        headerBackTitleVisible: false,
        headerTitleStyle: {fontFamily: FontFamily.Bold},
        contentStyle: {backgroundColor: Colors.background},
        orientation: 'portrait',
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="DrawerComponent"
        component={DrawerStack}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={'ChangePassword'}
        component={ChangePassword}
        options={{headerTitle: 'Change Password'}}
      />
      <Stack.Screen
        name={'UserList'}
        component={UserList}
        options={{headerTitle: 'User List'}}
      />
      <Stack.Screen
        name={'UserPrivileges'}
        component={UserPrivileges}
        options={{headerTitle: 'User Privileges'}}
      />
      {/* <Stack.Screen name={'Home'} component={Home} /> */}
      <Stack.Screen name={'OSListScreen'} component={OSListScreen} />
      <Stack.Screen
        name="OSData"
        component={OSData}
        options={{headerTitle: 'Out Standing'}}
      />
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
      <Stack.Screen name={'StockSummList'} component={StockSummList} />
      <Stack.Screen name={'StockSummFilter'} component={StockSummFilter} />
      <Stack.Screen name={'StockSummDetail'} component={StockSummDetail} />
      <Stack.Screen name={'SaleHome'} component={SaleHome} />
      <Stack.Screen
        name={'OrderConfig'}
        component={OrderConfig}
        options={{headerTitle: 'Select Party'}}
      />
      <Stack.Screen name={'TakeOrder'} component={TakeOrder} />
    </Stack.Navigator>
  );
};

export default AppStack;

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        // headerShown: true,
        drawerActiveBackgroundColor: '#007fff99',
        drawerActiveTintColor: Colors.WText,
        drawerInactiveTintColor: 'darkgray',
        drawerInactiveBackgroundColor: Colors.WText + 35,
        drawerStyle: {backgroundColor: 'transparent'},
        headerTintColor: Colors.WText,
        headerStyle: {backgroundColor: Colors.header},
        drawerContentStyle: {backgroundColor: Colors.background},
        sceneContainerStyle: {backgroundColor: Colors.background},
      }}
      drawerContent={props => <RNCDrawerView {...props} />}>
      <Drawer.Screen
        name={'Home'}
        component={Home}
        options={{
          headerTitle: 'Welcome to Strong Service',
          headerTitleStyle: {
            fontFamily: FontFamily.Black,
          },
        }}
      />
    </Drawer.Navigator>
  );
};
