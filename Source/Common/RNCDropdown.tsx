import {Colors, FontFamily, FontSize} from '@Constants';
import {ImageStyle, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';

import {Dropdown} from 'react-native-element-dropdown';
import React from 'react';
import normalize from 'react-native-normalize';

export interface DropDownProps {
  Data: any[];
  maxHeight?: number;
  value: string;
  activeColor?: string;
  searchPlaceholderText?: string;
  placeholderText: string;
  onChange: (text: {_index: number; label: string; value: string}) => void;
  style?: ViewStyle;
  dropdownstyle?: ViewStyle;
  placeholderstyle?: TextStyle;
  selectedtextstyle?: TextStyle;
  itemtextstyle?: TextStyle;
  inputsearchstyle?: ViewStyle;
  containerstyle?: ViewStyle;
  iconstyle?: ImageStyle;
  search?: boolean;
  iconColor?: string;
}

const RNCDropdown = (prop: DropDownProps) => {
  const {
    Data,
    maxHeight,
    value,
    activeColor,
    placeholderText,
    onChange,
    searchPlaceholderText,
    style,
    dropdownstyle,
    placeholderstyle,
    selectedtextstyle,
    inputsearchstyle,
    iconstyle,
    search,
    containerstyle,
    itemtextstyle,
    ...restProps
  } = prop;

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
        search={search}
        maxHeight={maxHeight || normalize(250)}
        labelField="label"
        valueField="value"
        placeholder={placeholderText}
        searchPlaceholder={searchPlaceholderText}
        value={value}
        onChange={onChange}
        itemTextStyle={[styles.itemTextStyle, itemtextstyle]}
        // fontFamily={FontFamily.Medium}
        {...restProps}
      />
    </View>
  );
};

export default RNCDropdown;

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    padding: normalize(10),
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
  },
  containerStyle: {
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: FontSize.font14,
    fontFamily: FontFamily.Medium,
    color: Colors.Black,
  },
  selectedTextStyle: {
    fontSize: FontSize.font14,
    fontFamily: FontFamily.Medium,
    color: Colors.Black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: FontSize.font14,
    fontFamily: FontFamily.Medium,
  },
  itemTextStyle: {
    color: Colors.Black,
  },
});
