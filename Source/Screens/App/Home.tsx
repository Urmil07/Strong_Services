import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {
  Colors,
  FontFamily,
  FontSize,
  NavigationRoutes,
  width,
} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {Functions} from '@Utils';
import {useAppDispatch} from '@ReduxHook';
import {
  EstrongReport,
  SetFilterLedger,
  SetFilterList,
  SetLoading,
  SetMastLedger,
  SetMastList,
} from 'Reducers';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '@/Interfaces/AppStackParamList';
import {ScrollView} from 'react-native-gesture-handler';
import {DB, createTable, getDBConnection} from '@/DB/database';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();
  const focused = useIsFocused();

  useEffect(() => {
    dispatch(SetFilterLedger([]));
    dispatch(SetFilterList([]));
    dispatch(SetMastLedger([]));
    dispatch(SetMastList([]));
  }, [focused]);

  const {format} = new Intl.NumberFormat('hi-In', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    const InitData = async () => {
      const User = await Functions.getUser();
      console.log('User', User);
      if (User?.entryrights == 'Owner') {
        dispatch(EstrongReport({EntryEmail: User?.entryemail}));
      } else if (User?.acctype == 'SALES') {
        dispatch(
          EstrongReport({EntryEmail: User?.entryemail, AccId: User?.accid}),
        );
      }
    };
    InitData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.card}} />
      <StatusBar backgroundColor={Colors.card} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.card,
          padding: normalize(10),
          paddingVertical: normalize(24),
        }}>
        <View />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <RNCText
            family={FontFamily.Bold}
            size={FontSize.font18}
            color={Colors.WText}>
            Welcome to Strong Services
          </RNCText>
        </View>
        <View />
      </View>
      <ScrollView style={{flex: 1}}>
        <RNCText
          style={{marginBottom: normalize(12)}}
          align="center"
          family={FontFamily.Black}
          size={FontSize.font18}>
          Reports
        </RNCText>

        <View style={{padding: normalize(10), gap: normalize(12)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={styles.box}
              onPress={() =>
                navigation.navigate('OSListScreen', {type: 'sale'})
              }>
              <RNCText
                color={Colors.WText}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                SaleOS
              </RNCText>
              <View style={styles.arrowBtn}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={normalize(16)}
                  color={Colors.Black}
                />
              </View>
            </Pressable>
            <Pressable
              style={styles.box}
              onPress={() =>
                navigation.navigate('OSListScreen', {type: 'purchase'})
              }>
              <RNCText
                color={Colors.WText}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                PurchaseOS
              </RNCText>
              <View style={styles.arrowBtn}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={normalize(16)}
                  color={Colors.Black}
                />
              </View>
            </Pressable>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={styles.box}
              onPress={() => navigation.navigate('LedgerScreen')}>
              <RNCText
                color={Colors.WText}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Ledger
              </RNCText>
              <View style={styles.arrowBtn}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={normalize(16)}
                  color={Colors.Black}
                />
              </View>
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
              <RNCText
                color={Colors.WText}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Lot Wise
              </RNCText>
              <View style={styles.arrowBtn}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={normalize(16)}
                  color={Colors.Black}
                />
              </View>
            </Pressable>
            <Pressable
              style={styles.box}
              onPress={() =>
                navigation.navigate('ColdList', {type: 'account'})
              }>
              <RNCText
                color={Colors.WText}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Acc. Wise
              </RNCText>
              <View style={styles.arrowBtn}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={normalize(16)}
                  color={Colors.Black}
                />
              </View>
            </Pressable>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable
              style={styles.box}
              onPress={() =>
                navigation.navigate('ColdList', {type: 'summary'})
              }>
              <RNCText
                color={Colors.WText}
                family={FontFamily.Bold}
                size={FontSize.font16}>
                Stock Summ
              </RNCText>
              <View style={styles.arrowBtn}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={normalize(16)}
                  color={Colors.Black}
                />
              </View>
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
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    padding: normalize(12),
  },
  arrowBtn: {
    backgroundColor: Colors.White + '90',
    padding: normalize(10),
    borderRadius: 100,
  },
});
