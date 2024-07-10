import {Colors, NavigationRoutes} from '@/Constants';
import {RNCLoader, RNCToast} from 'Common';
import React, {useEffect, useState} from 'react';
import {createTable, getDBConnection} from '@/DB/database';
import {setIsAuth, setOnBoarding, useAppStore} from '@Actions';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import BootSplash from 'react-native-bootsplash';
import {Functions} from '@Utils';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingScreen from '../../OnboardingScreen';
import SampleScreen from '../../SampleScreen';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const {IsAuth, OnBoarding} = useAppStore();

  useEffect(() => {
    // createTable();
    InitData().finally(async () => {
      setTimeout(() => {
        BootSplash.hide({fade: true});
      }, 1500);
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  const InitData = async () => {
    // await Functions.setUser({
    //   compdbname: 'GRCCLMAIN',
    //   entryName: 'Gauri Creation',
    //   entryemail: 'dssnvs@gmail.com',
    //   userpwd: 'g01',
    //   userrights: 'Owner',
    // });

    const AppData = await Functions.getAppData();
    console.log('AppData', AppData);
    if (AppData && !AppData.OnBoarding) {
      console.log('AppData.OnBoarding', AppData.OnBoarding);
      setOnBoarding(false);
    } else {
      setOnBoarding(true);
    }

    const User = await Functions.getUser();
    if (User) {
      setIsAuth(true);
    }

    const db = await getDBConnection();
    await createTable(db);
    // console.log('User', User);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNCLoader />
      <StatusBar backgroundColor={Colors.header} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: Colors.background},
            animation: 'slide_from_right',
          }}>
          {/* <OnboardingScreen /> */}
          {/* <Stack.Screen name="SampleScreen" component={SampleScreen} /> */}

          {OnBoarding && (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
          )}
          {!IsAuth ? (
            <Stack.Screen name={NavigationRoutes.AUTH} component={AuthStack} />
          ) : (
            <Stack.Screen name={NavigationRoutes.APP} component={AppStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <RNCToast />
    </GestureHandlerRootView>
  );
};

export default Routes;
