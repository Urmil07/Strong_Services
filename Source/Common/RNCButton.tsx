import {Pressable, PressableProps, TextStyle, ViewProps} from 'react-native';
import React from 'react';
import RNCText from './RNCText';
import RNCStyle from './RNCStyle';
import {FontFamily, FontSize} from '@Constants';

const RNCButton = (
  props: ViewProps & PressableProps & {name: string; btnTextStyle?: TextStyle},
) => {
  const {style, name, onPress, disabled, btnTextStyle, ...restProps} = props;

  return (
    <Pressable
      style={[RNCStyle.Btn, style, disabled && {opacity: 0.8}]}
      onPress={onPress}
      {...restProps}>
      <RNCText
        style={[RNCStyle.BtnText, disabled && {opacity: 0.8}, btnTextStyle]}>
        {name}
      </RNCText>
    </Pressable>
  );
};

export default RNCButton;
