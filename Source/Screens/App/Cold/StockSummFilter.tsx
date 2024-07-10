import {Colors, FontFamily, FontSize} from '@Constants';
import {
  GetStockSummary,
  getStockSummFilterData,
  resetFilter,
  setFilterAgent,
  setFilterBookname,
  setFilterEndDate,
  setFilterItem,
  setFilterLotno,
  setFilterStartDate,
  setLoading,
  useReportStore,
} from '@Actions';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {RNCButton, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';

import {DatePickerModal} from 'CApp';
import {DateType} from 'react-native-ui-datepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MultiSelect} from 'react-native-element-dropdown';
import {StockSummFilterPageProps} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';

const StockSummFilter: FC<StockSummFilterPageProps> = ({navigation, route}) => {
  const {
    MastBookname,
    MastAgent,
    MastItem,
    MastLotno,
    FilterAgent,
    FilterBookname,
    FilterItem,
    FilterLotno,
    FilterStartDate,
    FilterEndDate,
  } = useReportStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Stock Summary',
      headerStyle: {backgroundColor: Colors.header},
      headerTintColor: Colors.WText,
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      GetStockSummary();
    });
  }, [navigation]);

  useEffect(() => {
    getStockSummFilterData();
  }, []);

  useEffect(() => {
    if (FilterStartDate) setStartDate(FilterStartDate);
    if (FilterEndDate) setEndDate(FilterEndDate);
  }, [FilterStartDate, FilterEndDate]);

  const [DatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [DateType, setDateType] = useState<'start' | 'end'>('start');
  const [DateSelected, setDateSelected] = useState<Dayjs>(dayjs());
  const [StartDate, setStartDate] = useState<string>();
  const [EndDate, setEndDate] = useState<string>();
  const [Bookname, setBookname] = useState<string[]>([]);
  const [Itemname, setItemname] = useState<string[]>([]);
  const [Lotno, setLotno] = useState<string[]>([]);
  const [Agent, setAgent] = useState<string[]>([]);

  useEffect(() => {
    if (FilterBookname.length > 0) setBookname(FilterBookname);
    if (FilterItem.length) setItemname(FilterItem);
    if (FilterLotno.length) setLotno(FilterLotno);
    if (FilterAgent.length > 0) setAgent(FilterAgent);
  }, []);

  const handleDate = ({date}: {date: DateType}) => {
    setDateSelected(dayjs(date));
    if (DateType === 'start')
      setStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    // setFilterStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    if (DateType === 'end')
      setEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    // setFilterEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    setDatePickerVisible(false);
  };

  const handleApply = () => {
    setLoading(true);

    setFilterStartDate(StartDate);
    setFilterEndDate(EndDate);
    setFilterBookname(Bookname);
    setFilterItem(Itemname);
    setFilterLotno(Lotno);
    setFilterAgent(Agent);

    // navigation.replace('OSListScreen', {type});
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <DatePickerModal
        visible={DatePickerVisible}
        handleChange={handleDate}
        value={DateSelected}
        setVisible={setDatePickerVisible}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{gap: 10}}
        showsVerticalScrollIndicator={false}>
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
          <RNCText style={styles.title}>Bookname</RNCText>
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
            onChange={setBookname}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>

        <View style={{gap: 5}}>
          <RNCText style={styles.title}>Item</RNCText>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            search
            data={MastItem}
            labelField="label"
            valueField="value"
            placeholder="Select Item..."
            searchPlaceholder="Search..."
            value={Itemname}
            onChange={setItemname}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>

        <View style={{gap: 5}}>
          <RNCText style={styles.title}>Lot No.</RNCText>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            search
            data={MastLotno}
            labelField="label"
            valueField="value"
            placeholder="Select Item..."
            searchPlaceholder="Search..."
            value={Lotno}
            onChange={setLotno}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>

        <View style={{gap: 5}}>
          <RNCText style={styles.title}>Agent</RNCText>
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
            placeholder="Select Item..."
            searchPlaceholder="Search..."
            value={Agent}
            onChange={setAgent}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>
      </ScrollView>
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
            resetFilter();
            navigation.goBack();
          }}
        />
        <RNCButton
          name={'Apply'}
          style={{flex: 1}}
          btnTextStyle={{color: Colors.WText}}
          onPress={handleApply}
        />
      </View>
    </View>
  );
};

export default StockSummFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
  },
  scrollContainer: {
    flex: 1,
  },
  dropdown: {
    // backgroundColor: Colors.backgroundSecondary,
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
  title: {
    fontFamily: FontFamily.SemiBold,
    left: normalize(10),
  },
});
