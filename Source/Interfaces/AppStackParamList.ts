import {NavigationProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AppStackParamList = {
  Home: undefined;
  OSListScreen: {type: 'sale' | 'purchase'};
  OSListFilter: undefined;
  LedgerScreen: undefined;
  OSData: {accid: string; compid: string; partyName: string};
  LedgerDetailScreen: {accid: string; compid: string; partyName: string};
  ColdList: {type: 'lot' | 'account' | 'summary'};
};
// ProductDetails: { id: number };

export type HomePageProps = NativeStackScreenProps<AppStackParamList, 'Home'>;
export type OSListScreenPageProps = NativeStackScreenProps<
  AppStackParamList,
  'OSListScreen'
>;
export type OSListFilterPageProps = NativeStackScreenProps<
  AppStackParamList,
  'OSListFilter'
>;
export type OSDataPageProps = NativeStackScreenProps<
  AppStackParamList,
  'OSData'
>;
export type LedgerScreenPageProps = NativeStackScreenProps<
  AppStackParamList,
  'LedgerScreen'
>;
export type LedgerDetailScreenPageProps = NativeStackScreenProps<
  AppStackParamList,
  'LedgerDetailScreen'
>;
export type ColdListPageProps = NativeStackScreenProps<
  AppStackParamList,
  'ColdList'
>;

export type StackNavigation = NavigationProp<AppStackParamList>;
