import {StyleSheet, Text, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {Images} from '@Constants';
import React from 'react';
import normalize from 'react-native-normalize';

const RNCNodata = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Colors.E855555,
      }}>
      <FastImage
        source={Images.Nodata}
        style={{height: normalize(300), width: '100%'}}
      />
      {/* <RNCText family={FontFamily.Bold} size={FontSize.font20}>
                No Data...
              </RNCText> */}
    </View>
  );
};

export default RNCNodata;

const styles = StyleSheet.create({});
