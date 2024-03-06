import Animated, {
  SlideInUp,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  GetLedger,
  GetLedgerFilterData,
  SetApplyFilter,
  SetFilterEndDate,
  SetFilterLedger,
  SetFilterStartDate,
  SetLoading,
  SetPartyWiseLedger,
} from 'Reducers';
import React, {useCallback, useEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import {DatePickerModal} from 'CApp';
import {DateType} from 'react-native-ui-datepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LedgerScreenPageProps} from '@/Interfaces/AppStackParamList';
import {RNCText} from 'Common';
import normalize from 'react-native-normalize';
import {setDate} from '@Utils';
import {useIsFocused} from '@react-navigation/native';

const OrderBy = [
  {label: 'Name', value: 'name'},
  {label: 'City', value: 'city'},
  {label: 'Date', value: 'date'},
  {label: 'Month', value: 'month'},
  {label: 'Subschedule', value: 'subschedule'},
];

const LedgerScreen = ({navigation}: LedgerScreenPageProps) => {
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const {
    FilterLedger,
    MastLedger,
    ApplyFilter,
    FilterStartDate,
    FilterEndDate,
  } = useAppSelector(({DBReducer}) => DBReducer);

  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');
  const [DateVisible, setDateVisible] = useState(false);
  const [OrderByVisible, setOrderByVisible] = useState(false);
  const [ListOrder, setListOrder] = useState<string>('name');
  const [DateSelected, setDateSelected] = useState<Dayjs | undefined>();
  const [DateType, setDateType] = useState<'start' | 'end'>('start');
  const [StartDate, setStartDate] = useState<Dayjs>();
  const [EndDate, setEndDate] = useState<Dayjs>();
  const [DatePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (focused && ApplyFilter) {
      dispatch(GetLedger({Orderby: ListOrder}));
      dispatch(SetApplyFilter(false));
    }
  }, [focused]);

  useEffect(() => {
    InitData();
  }, [ListOrder, FilterStartDate, FilterEndDate]);

  useEffect(() => {
    const DefaultDate = async () => {
      const Date = await setDate();
      if (FilterStartDate) {
        setStartDate(dayjs(FilterStartDate));
        console.log('FilterStartDate', FilterStartDate);
      } else {
        setStartDate(dayjs(Date.StartDate));
        console.log('Date', Date);
      }

      if (FilterEndDate) {
        setEndDate(dayjs(FilterEndDate));
        console.log('FilterEndDate', FilterEndDate);
      } else {
        setEndDate(dayjs(Date.EndDate));
        console.log('Date EndDate', Date);
      }
    };
    DefaultDate();
  }, []);

  const InitData = useCallback(async () => {
    console.log('ListOrder', ListOrder);
    dispatch(GetLedger({Orderby: ListOrder}));
    dispatch(GetLedgerFilterData())
      .unwrap()
      .then(() => {
        new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            dispatch(SetLoading(false));
          }, 800);
        });
      });
  }, [ListOrder]);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const handleSearch = (query: string) => {
    setSearchText(query);
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = MastLedger.filter(item => {
      const city = item.cityname.toLowerCase();
      const name = item.party.toLowerCase();

      return queryWords.every(
        word => name.includes(word) || city.includes(word),
      );
    });
    dispatch(SetFilterLedger(filteredResults));
  };

  const handleDate = ({date}: {date: DateType}) => {
    console.log('date', date);
    setDateSelected(dayjs(date));
    if (DateType === 'start') {
      dispatch(SetFilterStartDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss')));
      setStartDate(dayjs(date));
    }
    if (DateType === 'end') {
      dispatch(SetFilterEndDate(dayjs(date).format('YYYY-MM-DD HH:mm:ss')));
      setEndDate(dayjs(date));
    }
    setDatePickerVisible(false);
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />

      <DatePickerModal
        visible={DatePickerVisible}
        handleChange={handleDate}
        value={DateSelected}
        setVisible={setDatePickerVisible}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.header,
          paddingVertical: isAndroid ? normalize(17) : normalize(8),
        }}>
        {SearchEnable ? (
          <View
            style={{
              // width: '60%',
              padding: normalize(6),
              paddingHorizontal: normalize(15),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              flex: 1,
            }}>
            <TextInput
              style={{
                color: Colors.WText,
                fontFamily: FontFamily.Medium,
                fontSize: FontSize.font14,
                borderBottomColor: Colors.White,
                borderBottomWidth: StyleSheet.hairlineWidth,
                flex: 1,
                padding: normalize(5),
                backgroundColor: Colors.card,
                borderRadius: 4,
              }}
              value={SearchText}
              onChangeText={handleSearch}
              placeholder="Search"
              placeholderTextColor={Colors.White}
              autoFocus
            />
            <Pressable
              style={{
                backgroundColor: Colors.card,
                padding: 5,
                borderRadius: 4,
              }}
              onPress={() => handleSearch('')}>
              <RNCText color={Colors.WText}>Clear</RNCText>
            </Pressable>
            <Pressable
              onPress={() => setSearchEnable(!SearchEnable)}
              style={{
                backgroundColor: Colors.card,
                padding: 5,
                borderRadius: 4,
              }}>
              <RNCText color={Colors.WText}>Close</RNCText>

              {/* <FontAwesome6Icon
                name="xmark"
                color={Colors.WText}
                size={normalize(18)}
              /> */}
            </Pressable>
          </View>
        ) : (
          <>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                left: normalize(15),
              }}>
              <Pressable
                style={{padding: normalize(10), borderRadius: 100}}
                onPress={() => navigation.goBack()}>
                <FontAwesome6Icon
                  name="chevron-left"
                  size={normalize(20)}
                  color={Colors.WText}
                />
              </Pressable>
              <RNCText
                family={FontFamily.SemiBold}
                size={FontSize.font18}
                color={Colors.WText}>
                Ledger
              </RNCText>
            </View>

            <View
              style={{padding: normalize(10), flexDirection: 'row', gap: 4}}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: normalize(5),
                }}
                onPress={() => setSearchEnable(!SearchEnable)}>
                <FontAwesome5
                  name="search"
                  size={normalize(20)}
                  color={Colors.WText}
                />
              </Pressable>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: normalize(5),
                }}
                onPress={() => navigation.navigate('LedgerFilter')}>
                <FontAwesome5
                  name="filter"
                  size={normalize(20)}
                  color={Colors.WText}
                />
              </Pressable>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: normalize(5),
                }}
                onPress={() => setDateVisible(!DateVisible)}>
                <Ionicons
                  name="calendar"
                  size={normalize(20)}
                  color={Colors.WText}
                />
              </Pressable>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: normalize(5),
                }}
                onPress={() => setOrderByVisible(!OrderByVisible)}>
                <FontAwesome5
                  name="sort-alpha-up"
                  size={normalize(20)}
                  color={Colors.WText}
                />
                {OrderByVisible && (
                  <Animated.View
                    entering={ZoomIn.duration(200)}
                    exiting={ZoomOut.duration(200)}
                    style={{
                      position: 'absolute',
                      width: normalize(120),
                      backgroundColor: Colors.header,
                      top: normalize(25),
                      right: 0,
                      borderRadius: 12,
                      zIndex: 1,
                      overflow: 'hidden',
                    }}>
                    {OrderBy.map((item, index) => (
                      <Pressable
                        key={index}
                        style={[
                          {
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: normalize(10),
                            // backgroundColor: Colors.E855555,
                            borderBottomColor: Colors.Black,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                          },
                          ListOrder == item.value && {
                            backgroundColor: Colors.backgroundSecondary,
                          },
                        ]}
                        onPress={() => {
                          setListOrder(item.value);
                          setOrderByVisible(false);
                        }}>
                        <RNCText
                          family={FontFamily.SemiBold}
                          style={[
                            ListOrder == item.value && {
                              color: Colors.Black,
                            },
                          ]}
                          color={
                            ListOrder == item.value
                              ? Colors.Black
                              : Colors.WText
                          }>
                          {item.label}
                        </RNCText>
                      </Pressable>
                    ))}
                  </Animated.View>
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>

      <View
        style={{
          flex: 1,
          padding: normalize(10),
          gap: 5,
          zIndex: -1,
        }}>
        {DateVisible && (
          <Animated.View
            entering={SlideInUp.duration(200)}
            exiting={SlideOutUp.duration(200)}
            style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.DateContainer}>
              <RNCText
                style={styles.DateTitle}
                family={FontFamily.Medium}
                size={FontSize.font12}>
                From Date:
              </RNCText>
              <Pressable
                style={styles.dateInput}
                onPress={() => {
                  setDateSelected(StartDate);
                  setDateType('start');
                  setDatePickerVisible(true);
                }}>
                <RNCText size={FontSize.font12}>
                  {StartDate?.format('DD/MM/YYYY')}
                </RNCText>
                <Ionicons
                  name="calendar"
                  size={normalize(20)}
                  color={Colors.Black}
                />
              </Pressable>
            </View>
            <View style={styles.DateContainer}>
              <RNCText
                style={styles.DateTitle}
                size={FontSize.font12}
                family={FontFamily.Medium}>
                To Date:
              </RNCText>
              <Pressable
                style={styles.dateInput}
                onPress={() => {
                  setDateSelected(EndDate);
                  setDateType('end');
                  setDatePickerVisible(true);
                }}>
                <RNCText size={FontSize.font12}>
                  {EndDate?.format('DD/MM/YYYY')}
                </RNCText>
                <Ionicons
                  name="calendar"
                  size={normalize(20)}
                  color={Colors.Black}
                />
              </Pressable>
            </View>
          </Animated.View>
        )}

        <FlatList
          data={FilterLedger}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <Pressable
                style={{
                  backgroundColor: Colors.backgroundSecondary,
                  paddingVertical: normalize(6),
                  paddingHorizontal: normalize(8),
                  borderRadius: 4,
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('LedgerDetailScreen', {
                    accid: item.accid,
                    compid: item.compid,
                    partyName: item.party,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '70%', gap: 3}}>
                    <RNCText
                      numberOfLines={2}
                      family={FontFamily.Bold}
                      size={FontSize.font11}>
                      {item.party}
                    </RNCText>
                    <RNCText size={FontSize.font10} numberOfLines={1}>
                      {item.cityname}
                    </RNCText>
                  </View>
                  <View style={{width: '30%', alignItems: 'flex-end'}}>
                    <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                      {`${format(Number(item.totalbal))} ${item.crdr}`}
                    </RNCText>
                  </View>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{gap: 5}}
          style={{marginBottom: 10}}
        />
      </View>
    </View>
  );
};

export default LedgerScreen;

const styles = StyleSheet.create({
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
  DateContainer: {flex: 1, gap: 3},
});
