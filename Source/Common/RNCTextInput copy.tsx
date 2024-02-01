import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInputPropsOptional} from '@/Interfaces/Common';
import normalize from 'react-native-normalize';
import {Colors, FontFamily, FontSize} from '@/Constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import RNCText from './RNCText';

type Prop = TextInputPropsOptional & {
  textInputStyle?: any;
  name: string;
  leftContainer?: any;
  rightContainer?: any;
};

const RNCTextInput = (prop: Prop) => {
  const {
    name,
    value,
    style,
    textInputStyle,
    multiline,
    numberOfLines = 1,
    onFocus,
    editable = true,
    onBlur,
    onChangeText,
    field,
    form,
    leftContainer,
    rightContainer,
    ...restOfProps
  } = prop;
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = useState(false);

  const inputValue = field?.value || value;
  const inputName = field?.name ?? name;
  let color = inputValue
    ? Colors.Black
    : !editable
    ? Colors.LightGrey
    : Colors.DarkGrey;
  let hasError;
  if (form) {
    hasError = form.errors[inputName] && form.touched[inputName];
    if (hasError) color = Colors.Danger;
  }

  return (
    <View style={{}}>
      <RNCText
        size={FontSize.font16}
        family={FontFamily.SemiBold}
        style={{left: normalize(12), marginBottom: normalize(2)}}>
        {name}
      </RNCText>
      <View style={styles.container}>
        {leftContainer}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              borderColor: color,
            },
            multiline && {height: numberOfLines * 40},
            hasError && styles.error,
            textInputStyle,
          ]}
          onBlur={event => {
            if (form && field) {
              form.setFieldTouched(inputName);
              field.onBlur(inputName);
            } else {
              onBlur?.(event);
            }
            setIsFocused(false);
          }}
          onFocus={event => {
            onFocus?.(event);
            setIsFocused(true);
          }}
          onChangeText={text => {
            if (form && field) {
              field.onChange(inputName)(text);
            } else {
              onChangeText(text);
            }
          }}
          multiline={multiline}
          value={inputValue}
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
    color: Colors.White,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: Colors.Danger,
    fontFamily: FontFamily.Medium,
  },
});
