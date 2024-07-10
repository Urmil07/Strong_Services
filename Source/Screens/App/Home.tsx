import {} from 'Reducers';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Colors, FontFamily, FontSize} from '@Constants';
import {
  EstrongReport,
  ResetAll,
  getActiveUser,
  isLoading,
  setLoading,
  setToast,
  setUserRights,
  useAppStore,
  useHomeStore,
} from '@Actions';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import {Drawer} from 'CApp';
import Feather from 'react-native-vector-icons/Feather';
import {Functions} from '@Utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RNCText} from 'Common';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigation} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';

const Data = [
  {
    name: 'Reports',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'header',
  },
  {
    name: 'Payable',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'data',
  },
  {
    name: 'Recivable',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'body',
  },
  {
    name: 'Ledger',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'body',
  },
  {
    name: 'Cold/Warehouse Reports',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'header',
  },
  {
    name: 'Lot Wise',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'body',
  },
  {
    name: 'Acc. Wise',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'body',
  },
  {
    name: 'Stock Summ.',
    icon: <View />,
    onPress: () => {},
    disabled: false,
    type: 'body',
  },
];

// const ListView: ListRenderItem<LedgerDataInterfase> = () => {};

const Home = () => {
  const navigation = useNavigation<StackNavigation>();
  const focused = useIsFocused();
  const {loading, UserRights} = useAppStore();
  const {ActiveUser} = useHomeStore();
  // console.log('ActiveUser', ActiveUser);
  // TODO: Add Reset All Data Function
  useEffect(() => {
    // dispatch(SetResetFilter(true));
    // dispatch(SetFilterStartDate(undefined));
    // dispatch(SetFilterEndDate(undefined));
    // dispatch(SetLedger([]));
    // dispatch(SetOSData([]));
    // dispatch(SetPartyWiseOS([]));
    // dispatch(
    //   SetPatyTotal({
    //     TotalBalAmt: 0,
    //     TotalBillAmt: 0,
    //     TotalPrevrecAmt: 0,
    //     TotalRecAmt: 0,
    //     TotalReturnAmt: 0,
    //   }),
    // );
    // dispatch(SetApplyFilter(false));

    if (focused) ResetAll();
  }, [focused]);

  const {format} = new Intl.NumberFormat('hi-In', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    const InitData = async () => {
      let UserRights: 'Owner' | 'Client' | 'Agent';
      const User = await Functions.getUser();
      UserRights = User?.userrights;
      setUserRights(UserRights);

      // FIXME: Remove Return
      // return;
      if (UserRights == 'Owner') {
        EstrongReport({EntryEmail: User?.entryemail});
      } else if (UserRights == 'Client' || UserRights == 'Agent') {
        EstrongReport({EntryEmail: User?.entryemail, AccId: User?.accid});
      }
    };
    InitData();
  }, []);

  useEffect(() => {
    const CheckData = async () => {
      // if (isLoading()) return;
      if (UserRights) {
        const User = await Functions.getUser();
        // console.log('User', User);
        if (UserRights == 'Owner') {
          const entryEmail = User.entryemail;
          const entryPwd = User.userpwd;
          getActiveUser({entryEmail, entryPwd});
        } else if (UserRights == 'Agent' || UserRights == 'Client') {
          const entryEmail = User.entryemail;
          const accId = User.accid;
          getActiveUser({entryEmail, accId});
        }

        // getActiveUser({});
      }
    };

    CheckData();
  }, [UserRights]);

  const isLocked = (name: string) => {
    setToast({toast: true, toastMessage: `${name} is locked`});
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />

      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <RNCText
          style={{marginVertical: normalize(12)}}
          align="center"
          family={FontFamily.Black}
          size={FontSize.font18}>
          Reports
        </RNCText>

        <View style={{padding: normalize(10), gap: 6}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={[styles.box]}
              onPress={() => {
                console.log('ActiveUser?.arepsaleos', ActiveUser);
                if (!ActiveUser?.arepsaleos) {
                  isLocked('Payable');
                  // FIXME: uncomment this line
                  // return;
                }
                navigation.navigate('OSListScreen', {
                  type: 'purchase',
                });
              }}>
              <View style={styles.arrowBtn}>
                <MaterialCommunityIcons
                  name="timer-sand-empty"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Payable
              </RNCText>
            </Pressable>

            <Pressable
              style={styles.box}
              onPress={() => {
                if (!ActiveUser?.areppurcos) {
                  isLocked('Recivable');
                  // FIXME: uncomment this line
                  // return;
                }

                navigation.navigate('OSListScreen', {type: 'sale'});
              }}>
              <View style={styles.arrowBtn}>
                <MaterialCommunityIcons
                  name="timer-sand-full"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Recivable
              </RNCText>
            </Pressable>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* <Pressable
              style={styles.box}
              onPress={() => {
                if (!ActiveUser?.arepledger) {
                  isLocked('Ledger');
                  return;
                }
                navigation.navigate('LedgerScreen');
              }}>
              <View style={styles.arrowBtn}>
                <MaterialCommunityIcons
                  name="notebook-multiple"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Ledger
              </RNCText>
            </Pressable> */}
            {/* <Pressable
              style={styles.box}
              onPress={() => navigation.navigate('LedgerScreen')}>
              <View style={styles.arrowBtn}>
                <MaterialCommunityIcons
                  name="notebook-multiple"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Ledger Summary
              </RNCText>
            </Pressable> */}
          </View>
        </View>

        <RNCText
          style={{marginVertical: normalize(12)}}
          align="center"
          family={FontFamily.Black}
          size={FontSize.font18}>
          Sales
        </RNCText>

        <View style={{padding: normalize(10), gap: 6}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={styles.box}
              onPress={() => {
                // if (!ActiveUser?.arepsaleorder) {
                //   isLocked('Sale Order');
                //   return;
                // }
                navigation.navigate('SaleHome');
              }}>
              <View style={styles.arrowBtn}>
                <Feather
                  name="package"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Sale Order
              </RNCText>
            </Pressable>

            <Pressable
              style={styles.box}
              // onPress={() =>
              //   navigation.navigate('ColdList', {type: 'summary'})
              // }
              onPress={() => null}>
              <View style={styles.arrowBtn}>
                <Feather
                  name="package"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Return Order
              </RNCText>
            </Pressable>
          </View>
        </View>

        <RNCText
          style={{marginVertical: normalize(12)}}
          align="center"
          family={FontFamily.Black}
          size={FontSize.font18}>
          Cold/Warehouse Reports
        </RNCText>

        <View style={{padding: normalize(10), gap: 6}}>
          {/* <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable
                style={styles.box}
                onPress={() => navigation.navigate('ColdList', {type: 'lot'})}>
                <View style={styles.arrowBtn}>
                  <MaterialCommunityIcons
                    name="cart"
                    size={normalize(24)}
                    color={Colors.WText}
                  />
                </View>
                <RNCText
                  color={Colors.Black}
                  family={FontFamily.Bold}
                  size={FontSize.font16}>
                  Lot Wise
                </RNCText>
              </Pressable>
              <Pressable
                style={styles.box}
                onPress={() =>
                  navigation.navigate('ColdList', {type: 'account'})
                }>
                <View style={styles.arrowBtn}>
                  <MaterialCommunityIcons
                    name="cart"
                    size={normalize(24)}
                    color={Colors.WText}
                  />
                </View>
                <RNCText
                  color={Colors.Black}
                  family={FontFamily.Bold}
                  size={FontSize.font16}>
                  Acc. Wise
                </RNCText>
              </Pressable>
            </View> */}

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={styles.box}
              onPress={() => {
                if (!ActiveUser?.arepsaleorder) {
                  isLocked('Stock Summ');
                  return;
                }
                navigation.navigate('StockSummList');
              }}>
              <View style={styles.arrowBtn}>
                <MaterialCommunityIcons
                  name="cart"
                  size={normalize(24)}
                  color={Colors.WText}
                />
              </View>
              <RNCText
                color={Colors.Black}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Stock Summ
              </RNCText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <SafeAreaView />
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: '49%',
    backgroundColor: Colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.card,
    borderRadius: 4,
    alignItems: 'center',
    gap: 10,
    padding: normalize(12),
  },

  arrowBtn: {
    backgroundColor: Colors.header,
    padding: normalize(10),
    borderRadius: 100,
  },
});
