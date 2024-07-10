import {Colors, FontFamily, FontSize} from '@/Constants';
import {StyleSheet, View} from 'react-native';

import {ActivityIndicator} from 'react-native-paper';
import {LoaderProps} from '@/Interfaces/Common';
import RNCStyle from './RNCStyle';
import RNCText from './RNCText';
import React from 'react';
import normalize from 'react-native-normalize';
import {useAppStore} from '@Actions';

const RNCLoader = () => {
  const {loading} = useAppStore();
  if (loading)
    return (
      <View style={[styles.Container]}>
        <View style={[styles.LoderView]}>
          <ActivityIndicator
            size={normalize(30)}
            animating={true}
            color={Colors.WText}
          />
          <RNCText
            family={FontFamily.Bold}
            size={FontSize.font16}
            color={Colors.WText}>
            Loading...
          </RNCText>
        </View>
      </View>
    );
};

export default RNCLoader;

const styles = StyleSheet.create({
  Container: {
    ...RNCStyle.center,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: Colors.Black + '99',
  },
  LoderView: {
    justifyContent: 'space-evenly',
    alignItems: 'center',

    height: normalize(110),
    width: normalize(110),
    borderRadius: 12,
    backgroundColor: Colors.header,
  },
});
