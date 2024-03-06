import {Colors, FontFamily, FontSize, NavigationRoutes} from '@/Constants';
import React, {useEffect} from 'react';
import {createTable, getDBConnection} from '@/DB/database';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
// import SampleScreen from '../../SampleScreen';
import BootSplash from 'react-native-bootsplash';
import {Functions} from '@Utils';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {RNCLoader} from 'Common';
import {SetIsAuth} from 'Reducers';
import {ToastProvider} from 'react-native-toast-notifications';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const dispatch = useAppDispatch();
  const {IsAuth} = useAppSelector(({LoginReducer}) => LoginReducer);
  const {Loading} = useAppSelector(({AppReducer}) => AppReducer);

  useEffect(() => {
    // createTable();
    InitData().finally(async () => {
      await BootSplash.hide({fade: true});
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

    const User = await Functions.getUser();
    if (User) {
      dispatch(SetIsAuth(false));
    }

    const db = await getDBConnection();
    await createTable(db);
    // console.log('User', User);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNCLoader visible={Loading} />

      <ToastProvider
        textStyle={{
          fontSize: FontSize.font14,
          fontFamily: FontFamily.Medium,
        }}
        animationType="zoom-in"
        offsetBottom={60}
        placement="bottom"
        duration={4000}
        animationDuration={200}
        data={'Tost'}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: {backgroundColor: Colors.background},
              animation: 'slide_from_right',
            }}>
            {/* <Stack.Screen name="SampleScreen" component={SampleScreen} /> */}
            {IsAuth ? (
              <Stack.Screen
                name={NavigationRoutes.AUTH}
                component={AuthStack}
              />
            ) : (
              <Stack.Screen name={NavigationRoutes.APP} component={AppStack} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </GestureHandlerRootView>
  );
};

export default Routes;
