import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FormValues} from '@/Interfaces/Common';
import normalize from 'react-native-normalize';
import {Colors, FontFamily, FontSize} from '@/Constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import RNCText from './RNCText';
import {Control, FieldPath, useController} from 'react-hook-form';

// type Prop = TextInputPropsOptional & {
type Prop = TextInputProps & {
  containerStyle?: any;
  textInputStyle?: any;
  title: string;
  leftContainer?: any;
  rightContainer?: any;
  control: Control<FormValues>;
  name: FieldPath<FormValues>;
};

const RNCTextInput = (prop: Prop) => {
  const {
    control,
    value,
    style,
    textInputStyle,
    multiline,
    numberOfLines = 1,
    onFocus,
    editable = true,
    onBlur,
    onChangeText,
    leftContainer,
    rightContainer,
    title,
    name,
    containerStyle,
    ...restOfProps
  } = prop;
  const inputRef = useRef<TextInput>(null);
  const {field} = useController({control, defaultValue: '', name});
  return (
    <View style={style}>
      {/* <RNCText
        size={FontSize.font16}
        family={FontFamily.SemiBold}
        style={{left: normalize(12), marginBottom: normalize(2)}}>
        {title}
      </RNCText> */}
      <View style={[styles.container, containerStyle]}>
        {leftContainer}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            multiline && {height: numberOfLines * 40},
            // hasError && styles.error,
            textInputStyle,
          ]}
          onBlur={event => {}}
          onFocus={event => {}}
          onChangeText={field.onChange}
          multiline={multiline}
          value={field.value}
          editable={editable}
          {...restOfProps}
        />
        {rightContainer}
      </View>
    </View>
  );
};

export default RNCTextInput;

const styles = StyleSheet.create({
  container: {
    // height: normalize(50),
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(5),
  },
  LeftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(50),
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: Colors.White,
  },
  RightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(50),
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: Colors.White,
  },
  input: {
    padding: normalize(10),
    fontFamily: FontFamily.Medium,
    fontSize: FontSize.font16,
    flex: 1,
    color: Colors.Black,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: Colors.Danger,
    fontFamily: FontFamily.Medium,
  },
});
