import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';
import {Colors, FontFamily} from '@Constants';

const Home = () => {
  const tableHead = [
    'Head',
    'Head2',
    'Head3',
    'Head4',
    'Head5',
    'Head6',
    'Head7',
    'Head8',
    'Head9',
  ];
  const widthArr = [40, 60, 80, 100, 120, 140, 160, 180, 200];
  // const tableData = [
  //   ['John', '28', 'Male'],
  //   ['Jane', '22', 'Female'],
  //   ['Tom', '35', 'Male'],
  //   ['Lucy', '23', 'Female'],
  // ];

  const tableData = [];
  for (let i = 0; i < 30; i += 1) {
    const rowData = [];
    for (let j = 0; j < 9; j += 1) {
      rowData.push(`${i}${j}`);
    }
    tableData.push(rowData);
  }

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
          <View>
            <View style={{flexDirection: 'row'}}>
              {tableHead.map((row, headIndex) => {
                return (
                  <View
                    key={headIndex}
                    style={{
                      width: normalize(80),
                      height: normalize(40),
                      borderLeftWidth: 1,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <RNCText color={Colors.White} family={FontFamily.SemiBold}>
                      {row}
                    </RNCText>
                  </View>
                );
              })}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {tableData.map((rowData, BodyIndex) => {
                return (
                  <View style={[{flexDirection: 'row'}]} key={BodyIndex}>
                    {rowData.map((row, rowIndex) => {
                      return (
                        <View
                          key={rowIndex}
                          style={{
                            width: normalize(80),
                            height: normalize(40),
                            borderWidth: StyleSheet.hairlineWidth,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <RNCText color={Colors.White}>{row}</RNCText>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
            {/* <ScrollView style={styles.dataWrapper}>
            <View>
              {tableData.map((rowData, index) => {
                return (
                  <View
                    style={{
                      width: normalize(80),
                      height: normalize(40),
                      backgroundColor: '#E85555',
                      borderLeftWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <RNCText>{rowData}</RNCText>
                  </View>
                );
              })}
              </View>
            </ScrollView> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
