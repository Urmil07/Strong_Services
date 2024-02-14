import {StyleSheet, View} from 'react-native';
import React from 'react';
import normalize from 'react-native-normalize';
import {Colors, FontFamily, FontSize} from '@/Constants';
import RNCStyle from './RNCStyle';
import {LoaderProps} from '@/Interfaces/Common';
import {ActivityIndicator} from 'react-native-paper';
import RNCText from './RNCText';

const RNCLoader = (props: LoaderProps) => {
  const {
    visible,
    LoaderFontStyle,
    LoderViewStyle,
    size = normalize(30),
    style,
  } = props;

  if (visible)
    return (
      <View style={[styles.Container, style]}>
        <View style={[styles.LoderView, LoderViewStyle]}>
          <ActivityIndicator
            size={size}
            animating={true}
            color={Colors.backgroundSecondary}
          />
          <RNCText
            family={FontFamily.SemiBold}
            size={FontSize.font15}
            color={Colors.backgroundSecondary}
            style={LoaderFontStyle}>
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
    alignSelf: 'center',
    height: normalize(110),
    width: normalize(110),
    borderRadius: 12,
    backgroundColor: Colors.card,
  },
});
