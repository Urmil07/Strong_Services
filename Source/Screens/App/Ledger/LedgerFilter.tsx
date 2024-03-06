import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RNCButton, RNCText} from 'Common';
import {
  SetApplyFilter,
  SetFilterArea,
  SetFilterCity,
  SetFilterMonth,
  SetFilterSubschedule,
  SetResetFilter,
} from 'Reducers';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {MultiSelect} from 'react-native-element-dropdown';
import React from 'react';
import {StackNavigation} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';
import {useNavigation} from '@react-navigation/native';

type Props = {};

const LedgerFilter = (props: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useAppDispatch();
  const {
    MastCity,
    MastArea,
    MasterSubschedule,
    MasterMonth,
    FilterCity,
    FilterArea,
    FilterSubschedule,
    FilterMonth,
  } = useAppSelector(({DBReducer}) => DBReducer);
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.header} />
      <SafeAreaView style={{backgroundColor: Colors.header}} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.header,
          paddingVertical: isAndroid ? normalize(17) : normalize(8),
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            left: normalize(15),
          }}>
          <Pressable
            style={{
              padding: normalize(10),
              borderRadius: 100,
            }}
            onPress={() => navigation.goBack()}>
            <FontAwesome6Icon
              name="chevron-left"
              size={normalize(20)}
              color={Colors.White}
            />
          </Pressable>
          <RNCText
            family={FontFamily.SemiBold}
            size={FontSize.font18}
            color={Colors.WText}>
            Filter
          </RNCText>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          padding: normalize(10),
          gap: 15,
        }}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={{gap: 5}}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              City
            </RNCText>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              search
              data={MastCity}
              labelField="label"
              valueField="value"
              placeholder="Select City..."
              searchPlaceholder="Search..."
              value={FilterCity}
              onChange={item => {
                dispatch(SetFilterCity(item));
              }}
              selectedStyle={styles.selectedStyle}
              activeColor={Colors.LightBlue}
              itemTextStyle={styles.itemTextStyle}
              fontFamily={FontFamily.Regular}
            />
          </View>

          <View style={{gap: 5}}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              Area
            </RNCText>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              search
              data={MastArea}
              labelField="label"
              valueField="value"
              placeholder="Select Area..."
              searchPlaceholder="Search..."
              value={FilterArea}
              onChange={item => {
                dispatch(SetFilterArea(item));
              }}
              selectedStyle={styles.selectedStyle}
              activeColor={Colors.LightBlue}
              itemTextStyle={styles.itemTextStyle}
              fontFamily={FontFamily.Regular}
            />
          </View>

          <View style={{gap: 5}}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              Month
            </RNCText>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              search
              data={MasterMonth}
              labelField="label"
              valueField="value"
              placeholder="Select Month..."
              searchPlaceholder="Search..."
              value={FilterMonth}
              onChange={item => {
                dispatch(SetFilterMonth(item));
              }}
              selectedStyle={styles.selectedStyle}
              activeColor={Colors.LightBlue}
              itemTextStyle={styles.itemTextStyle}
              fontFamily={FontFamily.Regular}
            />
          </View>

          <View style={{gap: 5}}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              Subschedule
            </RNCText>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              search
              data={MasterSubschedule}
              labelField="label"
              valueField="value"
              placeholder="Select Subschedule..."
              searchPlaceholder="Search..."
              value={FilterSubschedule}
              onChange={item => {
                dispatch(SetFilterSubschedule(item));
              }}
              selectedStyle={styles.selectedStyle}
              activeColor={Colors.LightBlue}
              itemTextStyle={styles.itemTextStyle}
              fontFamily={FontFamily.Regular}
            />
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
          alignSelf: 'flex-end',
          bottom: 0,
          padding: normalize(10),
        }}>
        <RNCButton
          name={'Reset'}
          style={{
            flex: 1,
            borderColor: Colors.btn,
            borderWidth: 1,
            backgroundColor: Colors.transparent,
          }}
          btnTextStyle={{color: Colors.Black}}
          onPress={() => {
            dispatch(SetResetFilter(true));
            navigation.goBack();
          }}
        />
        <RNCButton
          name={'Apply'}
          style={{flex: 1}}
          onPress={() => {
            dispatch(SetApplyFilter(true));
            navigation.goBack();
          }}
        />
      </View>
      <SafeAreaView />
    </View>
  );
};

export default LedgerFilter;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: normalize(10),
  },
  containerStyle: {
    borderRadius: 8,
    backgroundColor: Colors.White,
  },
  placeholderStyle: {
    fontSize: FontSize.font13,
    color: Colors.Black,
  },
  selectedTextStyle: {
    fontSize: FontSize.font13,
    color: Colors.Black,
    fontFamily: FontFamily.SemiBold,
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
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: Colors.White,
    color: Colors.Black,
  },
  itemTextStyle: {
    color: Colors.Black,
  },
});
