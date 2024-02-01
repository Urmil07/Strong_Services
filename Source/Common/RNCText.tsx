import {Text, TextProps} from 'react-native';
import React from 'react';
import {Colors, FontFamily, FontSize} from '@/Constants';
import {ExtraTextProps} from '@/Interfaces/Common';

const RNCText: React.FC<TextProps & ExtraTextProps> = props => {
  const {
    children,
    style,
    size,
    family,
    weight,
    align,
    color,
    pTop,
    pBottom,
    pLeft,
    pRight,
    pHorizontal,
    pVertical,
    spacing,
    ...restProps
  } = props;

  const TextStyles = {
    color: color ?? Colors.Text,
    fontSize: size ?? FontSize.font14,
    fontFamily: family ?? FontFamily.Medium,
    fontWeight: weight,
    textAlign: align ?? 'left',
    paddingTop: pTop,
    paddingLeft: pLeft,
    paddingRight: pRight,
    paddingBottom: pBottom,
    paddingHorizontal: pHorizontal,
    paddingVertical: pVertical,
    letterSpacing: spacing ?? 0.3,
  };

  return (
    <Text style={[TextStyles, style]} {...restProps}>
      {children}
    </Text>
  );
};

export default RNCText;
