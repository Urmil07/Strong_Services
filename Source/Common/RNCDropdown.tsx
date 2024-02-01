import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DropDownPropsOptional} from '@/Interfaces/Common';
import {Dropdown} from 'react-native-element-dropdown';
import normalize from 'react-native-normalize';
import {vs} from 'react-native-size-matters';
import {Colors, FontFamily, FontSize} from '@/Constants';
import RNCText from './RNCText';

type Prop = DropDownPropsOptional & {name: string};

const RNCDropdown = (props: Prop) => {
  const {
    name,
    Data,
    style,
    placeholderStyle,
    selectedTextStyle,
    inputSearchStyle,
    iconStyle,
    itemTextStyle,
    dropdownPosition = 'auto',
    containerStyle,
    placeholder,
    search = false,
    maxHeight,
    renderInputSearch,
    activeColor,
    onChange,
    value,
    disable = false,
    field,
    form,
    itemContainerStyle,
    searchPlaceholder = 'Search',
    ...restOfProps
  } = props;

  const inputValue = field?.value || value;
  const inputName = field?.name ?? name;
  let color = inputValue
    ? Colors.Black
    : disable
    ? Colors.LightGrey
    : Colors.DarkGrey;
  let hasError;
  if (form) {
    hasError = form.errors[inputName] && form.touched[inputName];
    if (hasError) color = Colors.Danger;
  }

  return (
    <View>
      <RNCText
        size={FontSize.font16}
        family={FontFamily.SemiBold}
        style={{left: normalize(12), marginBottom: normalize(2)}}>
        Languages
      </RNCText>
      <Dropdown
        activeColor={activeColor ?? Colors.backgroundSecondary}
        data={Data}
        style={[styles.style, style, {borderColor: color}]}
        placeholderStyle={[
          styles.placeholderStyle,
          placeholderStyle,
          {color: color},
        ]}
        itemContainerStyle={[styles.itemContainerStyle, itemContainerStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        itemTextStyle={[styles.itemTextStyle, itemTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={[styles.iconStyle, iconStyle]}
        iconColor={hasError ? color : disable ? Colors.LightGrey : Colors.White}
        maxHeight={maxHeight || normalize(100)}
        dropdownPosition={dropdownPosition}
        containerStyle={[styles.containerStyle, containerStyle]}
        fontFamily={FontFamily.Regular}
        labelField={'label'}
        valueField={'value'}
        placeholder={placeholder || ''}
        value={inputValue}
        onChange={Item => {
          if (form && field && !onChange) {
            form.setFieldTouched(field.name);
            field.onChange(field.name)(Item.value);
          } else {
            onChange?.(Item.value);
          }
        }}
        search={search}
        searchPlaceholder={searchPlaceholder}
        renderInputSearch={renderInputSearch}
        showsVerticalScrollIndicator={false}
        disable={disable}
        {...restOfProps}
      />
    </View>
  );
};

export default RNCDropdown;

const styles = StyleSheet.create({
  style: {
    borderRadius: 12,
    padding: normalize(10),
    backgroundColor: Colors.backgroundSecondary,
  },
  placeholderStyle: {left: normalize(20)},
  selectedTextStyle: {
    color: Colors.White,
    left: 6,
    fontSize: FontSize.font14,
    fontFamily: FontFamily.SemiBold,
  },
  itemContainerStyle: {
    borderBottomColor: Colors.LightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: normalize(6),
  },
  itemTextStyle: {
    color: Colors.White,
    fontSize: FontSize.font14,
    fontFamily: FontFamily.SemiBold,
    left: 6,
  },
  inputSearchStyle: {
    backgroundColor: Colors.GreyWhite,
    borderColor: Colors.Black,
    borderRadius: 8,
  },
  iconStyle: {right: 6},
  containerStyle: {
    top: -vs(1),
    backgroundColor: '#56596B',
    borderRadius: 12,
    overflow: 'hidden',
    padding: normalize(5),
  },
});
