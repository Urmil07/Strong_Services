import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import normalize from 'react-native-normalize';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {RNCText} from 'Common';
import {LedgerScreenPageProps} from '@/Interfaces/AppStackParamList';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {GetLedger} from 'Reducers';

const LedgerScreen = ({navigation, route}: LedgerScreenPageProps) => {
  const dispatch = useAppDispatch();
  const {FilterLedger} = useAppSelector(({DBReducer}) => DBReducer);

  const data = [
    {
      title: 'Section 1',
      data: [
        {id: 1, name: 'Item 1', value: 'Value 1'},
        {id: 2, name: 'Item 2', value: 'Value 2'},
        // Add more items as needed
      ],
    },
    {
      title: 'Section 2',
      data: [
        {id: 3, name: 'Item 3', value: 'Value 3'},
        {id: 4, name: 'Item 4', value: 'Value 4'},
        // Add more items as needed
      ],
    },
    // Add more sections as needed
  ];

  console.log('FilterLedger', FilterLedger);

  useEffect(() => {
    dispatch(GetLedger());
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
          paddingVertical: isAndroid ? normalize(17) : normalize(8),
          // paddingVertical: normalize(8),
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            left: normalize(15),
          }}>
          <Pressable
            style={{
              padding: normalize(10),
              borderRadius: 100,
            }}
            onPress={() => navigation.goBack()}>
            <FontAwesome6Icon
              name="chevron-left"
              size={normalize(20)}
              color={Colors.White}
            />
          </Pressable>
          <RNCText
            family={FontFamily.SemiBold}
            size={FontSize.font18}
            color={Colors.WText}>
            Account Ledger
          </RNCText>
        </View>
        <View />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{
          flexDirection: 'column',
          padding: normalize(10),
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={[
              styles.row,
              {
                width: normalize(110),
                alignItems: 'center',
                borderTopLeftRadius: 12,
              },
            ]}>
            <RNCText family={FontFamily.SemiBold}>LDate</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(200), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>Account</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(100), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>DrAmt</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(100), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>CrAmt</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(100), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>BalAmt</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(100), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>CrDr</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(100), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>Narration</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(200), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>Remark</RNCText>
          </View>
          <View
            style={[styles.row, {width: normalize(150), alignItems: 'center'}]}>
            <RNCText family={FontFamily.SemiBold}>Cheque</RNCText>
          </View>
          <View
            style={[
              styles.row,
              {
                width: normalize(150),
                alignItems: 'center',
                borderTopRightRadius: 12,
              },
            ]}>
            <RNCText family={FontFamily.SemiBold}>City</RNCText>
          </View>
        </View>
        <SectionList
          sections={FilterLedger}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.row,
                  {
                    width: normalize(110),
                    borderBottomLeftRadius:
                      index == FilterLedger.length - 1 ? 12 : 0,
                  },
                ]}>
                <RNCText numberOfLines={1}>{item.ldate}</RNCText>
              </View>
              <View style={[styles.row, {width: normalize(200)}]}>
                <RNCText numberOfLines={1}>{item.account}</RNCText>
              </View>
              <View
                style={[
                  styles.row,
                  {width: normalize(100), alignItems: 'flex-end'},
                ]}>
                <RNCText>{item.dramt}</RNCText>
              </View>
              <View
                style={[
                  styles.row,
                  {width: normalize(100), alignItems: 'flex-end'},
                ]}>
                <RNCText>{item.cramt}</RNCText>
              </View>
              <View
                style={[
                  styles.row,
                  {width: normalize(100), alignItems: 'flex-end'},
                ]}>
                <RNCText>{item.balamt}</RNCText>
              </View>
              <View
                style={[
                  styles.row,
                  {width: normalize(100), alignItems: 'center'},
                ]}>
                <RNCText>{item.crdr}</RNCText>
              </View>
              <View
                style={[
                  styles.row,
                  {width: normalize(100), alignItems: 'center'},
                ]}>
                <RNCText numberOfLines={1}>{item.narration}</RNCText>
              </View>
              <View style={[styles.row, {width: normalize(200)}]}>
                <RNCText numberOfLines={1}>{item.remarks}</RNCText>
              </View>
              <View style={[styles.row, {width: normalize(150)}]}>
                <RNCText numberOfLines={1}>{item.cheque}</RNCText>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    width: normalize(150),
                    alignItems: 'center',
                    borderBottomRightRadius:
                      index == FilterLedger.length - 1 ? 12 : 0,
                  },
                ]}>
                <RNCText numberOfLines={1}>{item.cityname}</RNCText>
              </View>
            </View>
          )}
          renderSectionHeader={({section: {party}}) => (
            <View
              style={{
                backgroundColor: Colors.E808080,
                padding: normalize(5),
              }}>
              <RNCText size={FontSize.font16} family={FontFamily.Black}>
                {party}
              </RNCText>
            </View>
          )}
          style={{flex: 1}}
        />
      </ScrollView>
    </View>
  );
};

export default LedgerScreen;

const styles = StyleSheet.create({
  row: {
    padding: normalize(5),
    // backgroundColor: Colors.background ,
    borderColor: Colors.Black,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
