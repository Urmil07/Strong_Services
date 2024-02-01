import {SafeAreaView, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
// import {NavigationRoutes} from '@/Constants';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors, FontFamily, FontSize, NavigationRoutes} from '@/Constants';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {RNCLoader, RNCToast} from 'Common';
import {createTable} from '@/DB/database';
import {Functions} from '@Utils';
import {SetIsAuth} from 'Reducers';
import {ToastProvider, useToast} from 'react-native-toast-notifications';
import SampleScreen from '../../SampleScreen';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const dispatch = useAppDispatch();
  const {IsAuth} = useAppSelector(({LoginReducer}) => LoginReducer);
  const {Loading} = useAppSelector(({AppReducer}) => AppReducer);

  useEffect(() => {
    createTable();
    InitData();
  }, []);

  const InitData = async () => {
    const User = await Functions.getUser();
    if (User) {
      dispatch(SetIsAuth(false));
    }
    // console.log('User', User);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNCLoader visible={Loading} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
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
              }}>
              {/* <Stack.Screen name="SampleScreen" component={SampleScreen} /> */}
              {IsAuth ? (
                <Stack.Screen
                  name={NavigationRoutes.AUTH}
                  component={AuthStack}
                />
              ) : (
                <Stack.Screen
                  name={NavigationRoutes.APP}
                  component={AppStack}
                />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Routes;
