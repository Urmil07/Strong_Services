import {ImageStyle, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import normalize from 'react-native-normalize';
import {Colors, FontFamily, FontSize} from '@Constants';
import {Control, FieldPath, useController} from 'react-hook-form';
import {FormValues} from '@/Interfaces/Common';

export interface DropDownProps {
  Data: any[];
  maxHeight?: number;
  activeColor?: string;
  placeholderText: string;
  searchPlaceholderText?: string;
  control: Control<FormValues>;
  name: FieldPath<FormValues>;
  style?: ViewStyle;
  dropdownstyle?: ViewStyle;
  placeholderstyle?: TextStyle;
  selectedtextstyle?: TextStyle;
  itemtextstyle?: TextStyle;
  inputsearchstyle?: ViewStyle;
  containerstyle?: ViewStyle;
  iconstyle?: ImageStyle;
}

const RNCFormDropDown = (prop: DropDownProps) => {
  const {
    control,
    name,
    Data,
    maxHeight,
    activeColor,
    placeholderText,
    searchPlaceholderText,
    style,
    dropdownstyle,
    placeholderstyle,
    selectedtextstyle,
    inputsearchstyle,
    iconstyle,
    containerstyle,
    itemtextstyle,
    ...restProps
  } = prop;

  const {field} = useController({control, defaultValue: '', name});

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        activeColor={activeColor ?? Colors.LightBlue}
        style={[styles.dropdown, dropdownstyle]}
        placeholderStyle={[styles.placeholderStyle, placeholderstyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedtextstyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputsearchstyle]}
        iconStyle={[styles.iconStyle, iconstyle]}
        containerStyle={[styles.containerStyle, containerstyle]}
        data={Data}
        maxHeight={maxHeight || normalize(250)}
        labelField="label"
        valueField="value"
        placeholder={placeholderText}
        searchPlaceholder={searchPlaceholderText ?? 'Search...'}
        value={field.value}
        onChange={value => field.onChange(value.value)}
        itemTextStyle={[styles.itemTextStyle, itemtextstyle]}
        fontFamily={FontFamily.Regular}
        {...restProps}
      />
    </View>
  );
};

export default RNCFormDropDown;

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    padding: normalize(10),
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
  },
  containerStyle: {
    borderRadius: 12,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: FontSize.font13,
    color: Colors.Black,
  },
  selectedTextStyle: {
    fontSize: FontSize.font13,
    color: Colors.Black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: FontSize.font13,
    color: Colors.Black,
  },
  itemTextStyle: {
    color: Colors.Black,
  },
});
