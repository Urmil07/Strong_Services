import {
  View,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, FontFamily, FontSize, Images} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Functions} from '@Utils';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {
  EstrongReport,
  SetFilterLedger,
  SetFilterList,
  SetMastLedger,
  SetMastList,
  SetResetFilter,
} from 'Reducers';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '@/Interfaces/AppStackParamList';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const focused = useIsFocused();

  useEffect(() => {
    dispatch(SetFilterLedger([]));
    dispatch(SetFilterList([]));
    dispatch(SetMastLedger([]));
    dispatch(SetMastList([]));
    dispatch(SetResetFilter(true));
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

      if (UserRights == 'Owner') {
        dispatch(EstrongReport({EntryEmail: User?.entryemail}));
      } else if (UserRights == 'Client') {
        dispatch(
          EstrongReport({EntryEmail: User?.entryemail, AccId: User?.accid}),
        );
      }
    };
    // InitData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.header,
          paddingVertical: normalize(15),
        }}>
        <RNCText
          family={FontFamily.Bold}
          size={FontSize.font18}
          color={Colors.WText}>
          Welcome to Strong Services
        </RNCText>
      </View>
      <ScrollView style={{flex: 1}}>
        <RNCText
          style={{marginVertical: normalize(12)}}
          align="center"
          family={FontFamily.Black}
          size={FontSize.font18}>
          Reports
        </RNCText>

        <View style={{padding: normalize(10), gap: normalize(12)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={[styles.box]}
              onPress={() =>
                navigation.navigate('OSListScreen', {type: 'sale'})
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
                navigation.navigate('OSListScreen', {type: 'purchase'})
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

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                Ledger Summary
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

        <View style={{padding: normalize(10), gap: normalize(12)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={styles.box}
              onPress={() =>
                navigation.navigate('ColdList', {type: 'summary'})
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
  box: {
    // height: normalize(150),
    width: normalize(175),
    // backgroundColor: Colors.card,
    backgroundColor: Colors.transparent,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.card,
    borderRadius: 8,
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
