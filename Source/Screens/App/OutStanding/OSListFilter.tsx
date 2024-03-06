import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {
  GetFilterData,
  SetApplyFilter,
  SetFilterAgent,
  SetFilterArea,
  SetFilterBookname,
  SetFilterCity,
  SetFilterEndDate,
  SetFilterStartDate,
  SetResetFilter,
} from 'Reducers';
import {RNCButton, RNCText} from 'Common';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import dayjs, {Dayjs} from 'dayjs';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import {DatePickerModal} from 'CApp';
import {DateType} from 'react-native-ui-datepicker';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MultiSelect} from 'react-native-element-dropdown';
import {OSListFilterPageProps} from '@/Interfaces/AppStackParamList';
import {Pressable} from 'react-native';
import normalize from 'react-native-normalize';

const OSListFilter = ({navigation, route}: OSListFilterPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();
  const {
    MastAgent,
    MastCity,
    MastArea,
    MastBookname,
    FilterCity,
    FilterAgent,
    FilterArea,
    FilterBookname,
  } = useAppSelector(({DBReducer}) => DBReducer);

  const [selected, setSelected] = useState<string[]>([]);
  const [StartDate, setStartDate] = useState<Dayjs>();
  const [EndDate, setEndDate] = useState<Dayjs>();
  const [DateSelected, setDateSelected] = useState<Dayjs | undefined>();
  const [DateType, setDateType] = useState<'start' | 'end'>('start');
  const [DatePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch(GetFilterData({type}));
  }, []);

  // const handleDate = ({date}: {date: DateType}) => {
  //   console.log('date', date);
  //   setDateSelected(dayjs(date));
  //   if (DateType === 'start') {
  //     dispatch(SetFilterStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss')));
  //     setStartDate(dayjs(date));
  //   }
  //   if (DateType === 'end') {
  //     dispatch(SetFilterEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss')));
  //     setEndDate(dayjs(date));
  //   }
  //   setDatePickerVisible(false);
  // };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.header} />
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      {/* <DatePickerModal
        visible={DatePickerVisible}
        handleChange={handleDate}
        value={DateSelected}
        setVisible={setDatePickerVisible}
      /> */}

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
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 5}}>
          {/* <View style={{flexDirection: 'column', gap: 10}}> */}
          {/* <View style={styles.DateContainer}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              From Date:
            </RNCText>
            <Pressable
              style={styles.dateInput}
              onPress={() => {
                setDateSelected(StartDate);
                setDateType('start');
                setDatePickerVisible(true);
              }}>
              <RNCText>
                {StartDate ? StartDate?.format('DD/MM/YYYY') : '--/--/----'}
              </RNCText>
              <Ionicons
                name="calendar"
                size={normalize(30)}
                color={Colors.Black}
              />
            </Pressable>
          </View>

          <View style={styles.DateContainer}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              To Date:
            </RNCText>
            <Pressable
              style={styles.dateInput}
              onPress={() => {
                setDateSelected(EndDate);
                setDateType('end');
                setDatePickerVisible(true);
              }}>
              <RNCText>
                {EndDate ? EndDate?.format('DD/MM/YYYY') : '--/--/----'}
              </RNCText>
              <Ionicons
                name="calendar"
                size={normalize(30)}
                color={Colors.Black}
              />
            </Pressable>
          </View> */}
          {/* </View> */}

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
              Agent
            </RNCText>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              search
              data={MastAgent}
              labelField="label"
              valueField="value"
              placeholder="Select Agent..."
              searchPlaceholder="Search..."
              value={FilterAgent}
              onChange={item => {
                dispatch(SetFilterAgent(item));
              }}
              selectedStyle={styles.selectedStyle}
              activeColor={Colors.LightBlue}
              itemTextStyle={styles.itemTextStyle}
              fontFamily={FontFamily.Regular}
            />
          </View>

          <View style={{gap: 5}}>
            <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
              Bookname
            </RNCText>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              search
              data={MastBookname}
              labelField="label"
              valueField="value"
              placeholder="Select Bookname..."
              searchPlaceholder="Search..."
              value={FilterBookname}
              onChange={item => {
                dispatch(SetFilterBookname(item));
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
            borderColor: Colors.header,
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

export default OSListFilter;

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
  dateInput: {
    borderColor: Colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    padding: normalize(6),
    paddingHorizontal: normalize(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  DateTitle: {left: normalize(8)},
  DateContainer: {flex: 1, gap: 5},
});
