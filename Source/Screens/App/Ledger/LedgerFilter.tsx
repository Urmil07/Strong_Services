import {Colors, FontFamily, FontSize} from '@Constants';
import {
  GetLedger,
  ResetAll,
  setFilterArea,
  setFilterCity,
  setFilterEndDate,
  setFilterMonth,
  setFilterStartDate,
  setFilterSubschedule,
  setLoading,
  useReportStore,
} from '@Actions';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {RNCButton, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';

import {DatePickerModal} from 'CApp';
import {DateType} from 'react-native-ui-datepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LedgerFilterPageProps} from '@/Interfaces/AppStackParamList';
import {MultiSelect} from 'react-native-element-dropdown';
import normalize from 'react-native-normalize';

type Props = {};

const LedgerFilter: FC<LedgerFilterPageProps> = ({navigation, route}) => {
  const {ListOrder} = route.params;

  const {
    MastCity,
    MastArea,
    MasterSubschedule,
    MasterMonth,
    FilterCity,
    FilterArea,
    FilterSubschedule,
    FilterMonth,
    FilterStartDate,
    FilterEndDate,
  } = useReportStore();

  const [DateSelected, setDateSelected] = useState<Dayjs>(dayjs());
  const [DateType, setDateType] = useState<'start' | 'end'>('start');
  const [DatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [StartDate, setStartDate] = useState<string>();
  const [EndDate, setEndDate] = useState<string>();
  const [City, setCity] = useState<string[]>([]);
  const [Area, setArea] = useState<string[]>([]);
  const [Month, setMonth] = useState<string[]>([]);
  const [Subschedule, setSubschedule] = useState<string[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Ledger Filter',
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      setLoading(true);
      GetLedger({Orderby: ListOrder});
      setTimeout(() => {
        setLoading(false);
      }, 800);
    });
  }, [navigation]);

  useEffect(() => {
    if (FilterStartDate) setStartDate(FilterStartDate);
    if (FilterEndDate) setEndDate(FilterEndDate);
    if (FilterCity.length) setCity(FilterCity);
    if (FilterArea.length) setArea(FilterArea);
    if (FilterMonth.length) setMonth(FilterMonth);
    if (FilterSubschedule.length) setSubschedule(FilterSubschedule);
  }, []);

  const handleDate = ({date}: {date: DateType}) => {
    setDateSelected(dayjs(date));
    if (DateType === 'start')
      setStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    if (DateType === 'end')
      setEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    setDatePickerVisible(false);
  };

  const handleApply = () => {
    setLoading(true);
    if (StartDate) setFilterStartDate(StartDate);
    if (EndDate) setFilterEndDate(EndDate);
    if (City.length) setFilterCity(City);
    if (Area.length) setFilterArea(Area);
    if (Month.length) setFilterMonth(Month);
    if (Subschedule.length) setFilterSubschedule(Subschedule);
    navigation.goBack();
  };
  return (
    <View style={{flex: 1}}>
      <DatePickerModal
        visible={DatePickerVisible}
        handleChange={handleDate}
        value={DateSelected}
        setVisible={setDatePickerVisible}
      />

      <View
        style={{
          flex: 1,
          padding: normalize(10),
          gap: 15,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 10}}>
          <View style={{gap: 5}}>
            <RNCText style={styles.title}>Start Date</RNCText>
            <Pressable
              style={styles.dateInput}
              onPress={() => {
                setDateSelected(dayjs(StartDate));
                setDateType('start');
                setDatePickerVisible(true);
              }}>
              <RNCText size={FontSize.font13}>
                {StartDate
                  ? dayjs(StartDate)?.format('DD/MM/YYYY')
                  : '-- / -- / ----'}
              </RNCText>
              <Ionicons
                name="calendar"
                size={normalize(22)}
                color={Colors.Black}
              />
            </Pressable>
          </View>

          <View style={{gap: 5}}>
            <RNCText style={styles.title}>End Date</RNCText>
            <Pressable
              style={styles.dateInput}
              onPress={() => {
                setDateSelected(dayjs(EndDate));
                setDateType('end');
                setDatePickerVisible(true);
              }}>
              <RNCText size={FontSize.font13}>
                {EndDate
                  ? dayjs(EndDate)?.format('DD/MM/YYYY')
                  : ' -- / -- / ----'}
              </RNCText>
              <Ionicons
                name="calendar"
                size={normalize(22)}
                color={Colors.Black}
              />
            </Pressable>
          </View>

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
              value={City}
              onChange={item => setCity(item)}
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
              value={Area}
              onChange={item => setArea(item)}
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
              value={Month}
              onChange={item => setMonth(item)}
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
              value={Subschedule}
              onChange={item => setSubschedule(item)}
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
            setLoading(true);
            ResetAll();
            // dispatch(SetResetFilter(true));
            navigation.goBack();
          }}
        />
        <RNCButton name={'Apply'} style={{flex: 1}} onPress={handleApply} />
      </View>
      <SafeAreaView />
    </View>
  );
};

export default LedgerFilter;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 5,
    paddingHorizontal: normalize(8),
    borderColor: Colors.card,
    borderWidth: StyleSheet.hairlineWidth,
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
  title: {
    fontFamily: FontFamily.SemiBold,
    left: normalize(10),
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
});
