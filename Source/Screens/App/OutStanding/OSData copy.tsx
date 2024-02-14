import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {RNCText} from 'Common';
import normalize from 'react-native-normalize';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {OSDataPageProps, StackNavigation} from '@/Interfaces/AppStackParamList';
import {useNavigation} from '@react-navigation/native';

const OSData = ({navigation, route}: OSDataPageProps) => {
  const {item} = route.params;
  const {accid, accname, data, totalbill} = item!;
  // const navigation = useNavigation<StackNavigation>();

  const Date = new Intl.DateTimeFormat('en-US');
  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.card}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.card,
          paddingVertical: isAndroid ? normalize(10) : 0,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 15,
            left: normalize(15),
          }}>
          <Pressable
            style={{
              padding: normalize(10),
              // backgroundColor: Colors.background + '99',
              borderRadius: 100,
            }}
            onPress={() => navigation.goBack()}>
            <FontAwesome6Icon
              name="chevron-left"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
          <RNCText
            family={FontFamily.SemiBold}
            size={FontSize.font18}
            color={Colors.WText}>
            {accname}
          </RNCText>
        </View>
        <View />
      </View>

      <View style={{flex: 1, padding: normalize(10)}}>
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          style={{
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          <View style={{}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[styles.header, {width: 80, borderTopLeftRadius: 12}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Inc No
                </RNCText>
              </View>
              <View style={[styles.header, {width: 120}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Date
                </RNCText>
              </View>
              <View style={[styles.header, {width: 180}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  AccName
                </RNCText>
              </View>
              <View style={[styles.header, {width: 100}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  BalAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: 120}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  City
                </RNCText>
              </View>
              <View style={[styles.header, {width: 130}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Mobile
                </RNCText>
              </View>
              <View style={[styles.header, {width: 100}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  BillAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: 100}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  PrevrecAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: 100}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  ReturnAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: 100}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  RecAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: 100}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  RunBalAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: 90}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Days
                </RNCText>
              </View>
              <View style={[styles.header, {width: 180}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  BookName
                </RNCText>
              </View>
              <View style={[styles.header, {width: 180}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  CompName
                </RNCText>
              </View>
              <View
                style={[styles.header, {width: 180, borderTopRightRadius: 12}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  AgentName
                </RNCText>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <View style={{flex: 1}}>
                {data.map((row, rowIndex) => (
                  <View style={[{flexDirection: 'row'}]} key={rowIndex}>
                    <View
                      style={[
                        styles.row,
                        {
                          width: 80,
                          borderBottomLeftRadius:
                            data.length - 1 == rowIndex ? 12 : 0,
                        },
                      ]}>
                      <RNCText color={Colors.White}>{row.invnochr}</RNCText>
                      {/* <RNCText color={Colors.White}>999999</RNCText> */}
                    </View>
                    <View style={[styles.row, {width: 120}]}>
                      {/* <RNCText color={Colors.White}>{row.invdate}</RNCText> */}
                      <RNCText color={Colors.White}>{row.invdate}</RNCText>
                      {/* <RNCText color={Colors.White}>99-99-9999</RNCText> */}
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 180, alignItems: 'flex-start'},
                      ]}>
                      <RNCText color={Colors.White} numberOfLines={1}>
                        {row.accname}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 100, alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.balamt))}
                      </RNCText>
                      {/* <RNCText color={Colors.White}>
                        {format(999999.99)}
                      </RNCText> */}
                    </View>
                    <View style={[styles.row, {width: 120}]}>
                      <RNCText color={Colors.White} numberOfLines={1}>
                        {row.cityname}
                      </RNCText>
                    </View>
                    <View style={[styles.row, {width: 130}]}>
                      <RNCText color={Colors.White}>{row.mobile}</RNCText>
                      {/* <RNCText color={Colors.White}>9999999999</RNCText> */}
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 100, alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.billamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 100, alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.prevrecamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 100, alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.returnamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 100, alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.recamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: 100, alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.runbalamt))}
                      </RNCText>
                    </View>
                    <View style={[styles.row, {width: 90}]}>
                      <RNCText color={Colors.White}>{row.days}</RNCText>
                    </View>
                    <View style={[styles.row, {width: 180}]}>
                      <RNCText color={Colors.White}>{row.bookname}</RNCText>
                    </View>
                    <View style={[styles.row, {width: 180}]}>
                      <RNCText color={Colors.White}>{row.compname}</RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {
                          width: 180,
                          borderBottomRightRadius:
                            data.length - 1 == rowIndex ? 12 : 0,
                        },
                      ]}>
                      <RNCText color={Colors.White}>{row.agentname}</RNCText>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      {/* <Text>OSData</Text> */}
    </View>
  );
};

export default OSData;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {
    padding: normalize(10),
    height: normalize(40),
    borderLeftWidth: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#537791',
    backgroundColor: Colors.card,
  },
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {
    padding: normalize(10),
    height: normalize(40),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#93C4E5',
    backgroundColor: Colors.card + '99',
  },
});
