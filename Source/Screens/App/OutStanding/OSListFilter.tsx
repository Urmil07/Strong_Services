import {Colors, FontFamily, FontSize} from '@Constants';
import {
  GetCompanys,
  GetFilterData,
  GetOSData,
  ResetAll,
  setFilterAgent,
  setFilterArea,
  setFilterBookname,
  setFilterCity,
  setFilterEndDate,
  setFilterStartDate,
  setLoading,
  useReportStore,
} from '@Actions';
import {RNCButton, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import dayjs, {Dayjs} from 'dayjs';

import {DatePickerModal} from 'CApp';
import {DateType} from 'react-native-ui-datepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MultiSelect} from 'react-native-element-dropdown';
import {OSListFilterPageProps} from '@/Interfaces/AppStackParamList';
import {Pressable} from 'react-native';
import normalize from 'react-native-normalize';

const OSListFilter: FC<OSListFilterPageProps> = ({navigation, route}) => {
  const {type, ListOrder} = route.params;

  const {
    MastBookname,
    FilterBookname,
    MastAgent,
    FilterAgent,
    MastCity,
    FilterCity,
    MastArea,
    FilterArea,
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
  const [Agent, setAgent] = useState<string[]>([]);
  const [Bookname, setBookname] = useState<string[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Out Standing Filter',
    });
  }, [navigation]);

  useEffect(() => {
    GetFilterData({type});
  }, []);

  useEffect(() => {
    navigation.addListener('blur', () => {
      GetOSData({type, Orderby: ListOrder});
      setTimeout(() => {
        setLoading(false);
      }, 800);
    });
  }, [navigation]);

  useEffect(() => {
    if (FilterStartDate) setStartDate(FilterStartDate);
    if (FilterEndDate) setStartDate(FilterEndDate);
    if (FilterCity.length > 0) setCity(FilterCity);
    if (FilterAgent.length > 0) setAgent(FilterAgent);
    if (FilterArea.length > 0) setArea(FilterArea);
    if (FilterBookname.length > 0) setBookname(FilterBookname);
  }, []);

  const handleDate = ({date}: {date: DateType}) => {
    setDateSelected(dayjs(date));
    if (DateType === 'start')
      setStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));
    // setFilterStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    if (DateType === 'end')
      // setFilterEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));
      setEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    setDatePickerVisible(false);
  };

  const handleApply = () => {
    setLoading(true);

    setFilterStartDate(StartDate);
    setFilterEndDate(EndDate);
    setFilterCity(City);
    setFilterAgent(Agent);
    setFilterArea(Area);
    setFilterBookname(Bookname);

    // navigation.replace('OSListScreen', {type});
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
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 5}}>
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
                {/* {FilterStartDate
                  ? dayjs(FilterStartDate)?.format('DD/MM/YYYY')
                  : '-- / -- / ----'} */}
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
                {/* {FilterEndDate
                  ? dayjs(FilterEndDate)?.format('DD/MM/YYYY')
                  : ' -- / -- / ----'} */}
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
              // value={FilterCity}
              // onChange={item => setFilterCity(item)}
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
              // value={FilterArea}
              // onChange={item => setFilterArea(item)}
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
              // value={FilterAgent}
              // onChange={item => setFilterAgent(item)}
              value={Agent}
              onChange={item => setAgent(item)}
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
              value={Bookname}
              onChange={item => setBookname(item)}
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
            setLoading(true);
            ResetAll();
            GetCompanys({type});
            navigation.goBack();
            // navigation.replace('OSListScreen', {type});
          }}
        />
        <RNCButton name={'Apply'} style={{flex: 1}} onPress={handleApply} />
      </View>
      <SafeAreaView />
    </View>
  );
};

export default OSListFilter;

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
  title: {
    fontFamily: FontFamily.SemiBold,
    left: normalize(10),
  },
});
