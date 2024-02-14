import {ImageStyle, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import normalize from 'react-native-normalize';
import {Colors, FontFamily, FontSize} from '@Constants';

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
        fontFamily={FontFamily.Regular}
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
    borderRadius: 12,
  },
  containerStyle: {
    borderRadius: 12,
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
