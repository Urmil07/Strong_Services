import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Colors, FontFamily} from '@Constants';
import {RNCText} from 'Common';
import normalize from 'react-native-normalize';

type ParamList = {
  OSData: {item: SaleOSInterfase};
};

const OSData = () => {
  const route = useRoute<RouteProp<ParamList, 'OSData'>>();
  const {accid, accname, data, totalbill} = route.params.item!;

  const Date = new Intl.DateTimeFormat('en-US');
  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const [showFields, setShowFields] = useState({
    accid: true,
    accname: true,
    agentid: true,
    agentname: true,
    balamt: true,
    billamt: true,
    bookname: true,
    cityname: true,
    compid: true,
    compname: true,
    customeremail: true,
    days: true,
    entryemail: true,
    entryid: true,
    invdate: true,
    invnochr: true,
    mobile: true,
    prevrecamt: true,
    recamt: true,
    returnamt: true,
    runbalamt: true,
    saleosid: true,
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: Colors.backgroundSecondary,
        }}>
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{}}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.header, {width: '5%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Inc No
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Date
                </RNCText>
              </View>
              <View style={[styles.header, {width: '12%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  AccName
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  BalAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  City
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Mobile
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  BillAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  PrevrecAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  ReturnAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  RecAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: '6%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  RunBalAmt
                </RNCText>
              </View>
              <View style={[styles.header, {width: '5%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  Days
                </RNCText>
              </View>
              <View style={[styles.header, {width: '10%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  BookName
                </RNCText>
              </View>
              <View style={[styles.header, {width: '10%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  CompName
                </RNCText>
              </View>
              <View style={[styles.header, {width: '10%'}]}>
                <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                  AgentName
                </RNCText>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}>
              <View style={{flex: 1}}>
                {data.map((row, rowIndex) => (
                  <View style={[{flexDirection: 'row'}]} key={rowIndex}>
                    <View style={[styles.row, {width: '5%'}]}>
                      <RNCText color={Colors.White}>{row.invnochr}</RNCText>
                      {/* <RNCText color={Colors.White}>999999</RNCText> */}
                    </View>
                    <View style={[styles.row, {width: '6%'}]}>
                      {/* <RNCText color={Colors.White}>{row.invdate}</RNCText> */}
                      <RNCText color={Colors.White}>{row.invdate}</RNCText>
                      {/* <RNCText color={Colors.White}>99-99-9999</RNCText> */}
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '12%', alignItems: 'flex-start'},
                      ]}>
                      <RNCText color={Colors.White} numberOfLines={1}>
                        {row.accname}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '6%', alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.balamt))}
                      </RNCText>
                      {/* <RNCText color={Colors.White}>
                        {format(999999.99)}
                      </RNCText> */}
                    </View>
                    <View style={[styles.row, {width: '6%'}]}>
                      <RNCText color={Colors.White} numberOfLines={1}>
                        {row.cityname}
                      </RNCText>
                    </View>
                    <View style={[styles.row, {width: '6%'}]}>
                      <RNCText color={Colors.White}>{row.mobile}</RNCText>
                      {/* <RNCText color={Colors.White}>9999999999</RNCText> */}
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '6%', alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.billamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '6%', alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.prevrecamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '6%', alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.returnamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '6%', alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.recamt))}
                      </RNCText>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {width: '6%', alignItems: 'flex-end'},
                      ]}>
                      <RNCText color={Colors.White}>
                        {format(Number(row.runbalamt))}
                      </RNCText>
                    </View>
                    <View style={[styles.row, {width: '5%'}]}>
                      <RNCText color={Colors.White}>{row.days}</RNCText>
                    </View>
                    <View style={[styles.row, {width: '10%'}]}>
                      <RNCText color={Colors.White}>{row.bookname}</RNCText>
                    </View>
                    <View style={[styles.row, {width: '10%'}]}>
                      <RNCText color={Colors.White}>{row.compname}</RNCText>
                    </View>
                    <View style={[styles.row, {width: '10%'}]}>
                      <RNCText color={Colors.White}>{row.agentname}</RNCText>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: '#537791',
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
  },
});
