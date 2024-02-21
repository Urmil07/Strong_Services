import {AlertProps} from '@/Interfaces/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Linking} from 'react-native';

type User = () => Promise<any>;
type AppData = (data: any) => void;

const ALERT = ({Title, Text, Buttons}: AlertProps) =>
  Alert.alert(Title, Text, Buttons);

const OpenUrl = (url: string) => Linking.openURL(url);

const setUser = async (data: any) =>
  await AsyncStorage.setItem('user', JSON.stringify(data));

const getUser: User = async () => {
  const value: any = await AsyncStorage.getItem('user');
  return JSON.parse(value);
};

const setAppData: AppData = async (data: any) => {
  const previousValue = await getAppData();
  if (previousValue) {
    await AsyncStorage.setItem(
      'appdata',
      JSON.stringify({...previousValue, ...data}),
    );
  } else {
    await AsyncStorage.setItem('appdata', JSON.stringify(data));
  }
};

const getAppData: User = async () => {
  const value: any = await AsyncStorage.getItem('appdata');
  return JSON.parse(value);
};

const getCurrentFinancialYear = () => {
  var fiscalyear = '';
  var today = new Date();
  if (today.getMonth() + 1 <= 3) {
    fiscalyear = today.getFullYear() - 1 + '-' + today.getFullYear();
  } else {
    fiscalyear = today.getFullYear() + '-' + (today.getFullYear() + 1);
  }
  return fiscalyear;
};

export default {
  ALERT,
  OpenUrl,
  setUser,
  getUser,
  setAppData,
  getAppData,
  getCurrentFinancialYear,
};
