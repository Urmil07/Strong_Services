import {FontFamily, FontSize, Images} from '@Constants';
import {StyleSheet, Text, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import RNCText from './RNCText';
import React from 'react';
import normalize from 'react-native-normalize';

const RNCNodata = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FastImage
        source={Images.Nodata}
        style={{height: normalize(300), width: '100%'}}
      />
      <RNCText family={FontFamily.Bold} size={FontSize.font18}>
        No Data...
      </RNCText>
    </View>
  );
};

export default RNCNodata;

const styles = StyleSheet.create({});
