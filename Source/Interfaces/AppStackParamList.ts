import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationProp} from '@react-navigation/native';

export type AppStackParamList = {
  Home: undefined;
  OSListScreen: {type: 'sale' | 'purchase'};
  OSListFilter: {type: 'sale' | 'purchase'};
  LedgerSummaryScreen: undefined;
  LedgerScreen: undefined;
  OSData: {
    accid: string;
    compid: string;
    city: string;
    area: string;
    mobile: string;
    partyName: string;
    type: 'sale' | 'purchase';
  };
  LedgerDetailScreen: {accid: string; compid: string; partyName: string};
  ColdList: {type: 'lot' | 'account' | 'summary'};
  LedgerFilter: undefined;
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
export type LedgerSummaryScreenPageProps = NativeStackScreenProps<
  AppStackParamList,
  'LedgerSummaryScreen'
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
export type LedgerFilter = NativeStackScreenProps<
  AppStackParamList,
  'ColdList'
>;

export type StackNavigation = NavigationProp<AppStackParamList>;
