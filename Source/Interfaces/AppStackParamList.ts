import {Datausermst} from './ReportInterface';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationProp} from '@react-navigation/native';
import {StockListProp} from './DBReducerInterFace';

export type AppStackParamList = {
  DrawerComponent: undefined;
  Home: undefined;
  OSListScreen: {type: 'sale' | 'purchase'};
  OSListFilter: {type: 'sale' | 'purchase'; ListOrder: string};
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
  ColdList: {type: 'lot' | 'account'};
  LedgerFilter: {ListOrder: string};
  StockSummList: undefined;
  StockSummFilter: undefined;
  StockSummDetail: {detail: StockListProp};
  SaleHome: undefined;
  TakeOrder: {
    compid: string;
    compname: string;
    bookid: string;
    bookname: string;
    accid: string;
    accname: string;
    areaname: string;
    agentid: string;
    agentname: string;
    flg: 0 | 1 | 2; // 0: New Order  1:View Order  2:Edit Order
  };
  ChangePassword: {
    entryemail: string;
    oldpwd: string;
    accrights: string;
    accId?: string;
    Type: 'Owner' | 'User';
    update?: boolean;
  };
  UserList: undefined;
  UserPrivileges: {User: Datausermst};
  OrderConfig: undefined;
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
export type LedgerFilterPageProps = NativeStackScreenProps<
  AppStackParamList,
  'LedgerFilter'
>;
export type StockSummListPageProps = NativeStackScreenProps<
  AppStackParamList,
  'StockSummList'
>;
export type StockSummFilterPageProps = NativeStackScreenProps<
  AppStackParamList,
  'StockSummFilter'
>;
export type StockSummDetailPageProps = NativeStackScreenProps<
  AppStackParamList,
  'StockSummDetail'
>;
export type SaleHomePageProps = NativeStackScreenProps<
  AppStackParamList,
  'SaleHome'
>;
export type TakeOrderPageProps = NativeStackScreenProps<
  AppStackParamList,
  'TakeOrder'
>;
export type ChangePasswordPageProps = NativeStackScreenProps<
  AppStackParamList,
  'ChangePassword'
>;
export type UserListPageProps = NativeStackScreenProps<
  AppStackParamList,
  'UserList'
>;
export type UserPrivilegesPageProps = NativeStackScreenProps<
  AppStackParamList,
  'UserPrivileges'
>;
export type OrderConfigPageProps = NativeStackScreenProps<
  AppStackParamList,
  'OrderConfig'
>;

export type StackNavigation = NavigationProp<AppStackParamList>;
