import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {
  EstrongReport,
  SetApplyFilter,
  SetFilterEndDate,
  SetFilterStartDate,
  SetLedger,
  SetOSData,
  SetPartyWiseOS,
  SetPatyTotal,
  SetResetFilter,
  SetUserRights,
} from 'Reducers';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {RNCButton, RNCText} from 'Common';
import React, {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import {Drawer} from 'CApp';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {Functions} from '@Utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigation} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';
import {useAppDispatch} from '@ReduxHook';

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
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const focused = useIsFocused();
  const active = useSharedValue(true);
  const drawerWidth = useSharedValue(3000);
  const drawerTranslateX = useSharedValue(-drawerWidth.value);

  useEffect(() => {
    dispatch(SetResetFilter(true));
    dispatch(SetFilterStartDate(undefined));
    dispatch(SetFilterEndDate(undefined));
    dispatch(SetLedger([]));
    dispatch(SetOSData([]));
    dispatch(SetPartyWiseOS([]));
    dispatch(
      SetPatyTotal({
        TotalBalAmt: 0,
        TotalBillAmt: 0,
        TotalPrevrecAmt: 0,
        TotalRecAmt: 0,
        TotalReturnAmt: 0,
      }),
    );
    dispatch(SetApplyFilter(false));
  }, [focused]);

  const {format} = new Intl.NumberFormat('hi-In', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    const InitData = async () => {
      let UserRights: 'Owner' | 'Client' | 'Agent';
      const User = await Functions.getUser();
      console.log('User', User);
      UserRights = User?.userrights;
      dispatch(SetUserRights(UserRights));

      // return;
      if (UserRights == 'Owner') {
        dispatch(EstrongReport({EntryEmail: User?.entryemail}));
      } else if (UserRights == 'Client') {
        dispatch(
          EstrongReport({EntryEmail: User?.entryemail, AccId: User?.accid}),
        );
      }
    };
    InitData();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const containerTranslateX = interpolate(
      drawerTranslateX.value,
      [-drawerWidth.value, 0],
      [0, 100],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{translateX: -containerTranslateX}],
    };
  });

  return (
    <>
      <Drawer
        active={active}
        translateX={drawerTranslateX}
        drawerWidth={drawerWidth}
      />
      <Animated.View style={[{flex: 1}, animatedStyle]}>
        <SafeAreaView style={{backgroundColor: Colors.header}} />
        <StatusBar backgroundColor={Colors.header} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.header,
            paddingVertical: normalize(17),
            paddingHorizontal: normalize(10),
          }}>
          <View>
            <FontAwesome6Icon
              name="bars"
              color={Colors.transparent}
              size={normalize(20)}
            />
          </View>
          <RNCText
            family={FontFamily.Bold}
            size={FontSize.font17}
            color={Colors.WText}>
            Welcome to Strong Services
          </RNCText>
          <View>
            <Pressable
              onPress={() => {
                active.value = true;
              }}>
              <FontAwesome6Icon
                name="bars"
                size={normalize(20)}
                color={Colors.WText}
              />
            </Pressable>
          </View>
        </View>

        {/* <FlatList data={Data} renderItem={ListView} /> */}

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
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable
                style={[styles.box]}
                onPress={() =>
                  navigation.navigate('OSListScreen', {type: 'purchase'})
                }>
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
                onPress={() =>
                  navigation.navigate('OSListScreen', {type: 'sale'})
                }>
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

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable
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
                  Ledger
                </RNCText>
              </Pressable>
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
            Cold/Warehouse Reports
          </RNCText>

          <View style={{padding: normalize(10), gap: 6}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable
                style={styles.box}
                // onPress={() => navigation.navigate('ColdList', {type: 'lot'})}
                onPress={() => null}>
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
                // onPress={() =>
                //   navigation.navigate('ColdList', {type: 'account'})
                // }
                onPress={() => null}>
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
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable
                style={styles.box}
                // onPress={() =>
                //   navigation.navigate('ColdList', {type: 'summary'})
                // }
                onPress={() => null}>
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
      </Animated.View>
    </>
  );
};

export default Home;
const styles = StyleSheet.create({
  box: {
    // height: normalize(150),
    // width: normalize(175),
    width: '49%',
    backgroundColor: Colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.card,
    borderRadius: 4,
    alignItems: 'center',
    gap: 10,
    padding: normalize(12),
    // ...RNCStyle.shadow,
  },

  arrowBtn: {
    backgroundColor: Colors.header,
    padding: normalize(10),
    borderRadius: 100,
  },
});
