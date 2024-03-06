import Animated, {
  SlideInUp,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {
  Colors,
  FontFamily,
  FontSize,
  Images,
  isAndroid,
  width,
} from '@Constants';
import {CompanyCard, DatePickerModal} from 'CApp';
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
  GetCompanys,
  GetSaleOS,
  SetApplyFilter,
  SetFilterEndDate,
  SetFilterList,
  SetFilterStartDate,
  SetLoading,
  SetOSCompny,
} from 'Reducers';
import {RNCNodata, RNCText} from 'Common';
import React, {useCallback, useEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import {DateType} from 'react-native-ui-datepicker';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {OSListScreenPageProps} from '@/Interfaces/AppStackParamList';
import Zocial from 'react-native-vector-icons/Zocial';
import normalize from 'react-native-normalize';
import {setDate} from '@Utils';
import {useIsFocused} from '@react-navigation/native';

const OrderBy = [
  {label: 'Name', value: 'name'},
  {label: 'City', value: 'city'},
  {label: 'Date', value: 'date'},
];

const OSListScreen = ({navigation, route}: OSListScreenPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();
  const {
    FilterCompany,
    FilterList,
    MastList,
    ApplyFilter,
    FilterStartDate,
    FilterEndDate,
  } = useAppSelector(({DBReducer}) => DBReducer);
  const {UserRights} = useAppSelector(({AppReducer}) => AppReducer);
  const focused = useIsFocused();
  const ref = React.useRef<ICarouselInstance>(null);

  const [ListOrder, setListOrder] = useState('name');
  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');
  const [Selected, setSelected] = useState(true);
  const [data, setData] = React.useState([...new Array(6).keys()]);
  const [OrderByVisible, setOrderByVisible] = useState(false);
  const [DateVisible, setDateVisible] = useState(false);
  const [DateType, setDateType] = useState<'start' | 'end'>('start');
  const [DatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [StartDate, setStartDate] = useState<Dayjs | undefined>();
  const [EndDate, setEndDate] = useState<Dayjs | undefined>();
  const [DateSelected, setDateSelected] = useState<Dayjs | undefined>();

  useEffect(() => {
    if (focused && ApplyFilter) {
      FetchData();
      dispatch(SetApplyFilter(false));
    }
  }, [focused]);

  useEffect(() => {
    dispatch(GetCompanys({type}));
  }, []);

  useEffect(() => {
    FetchData();
  }, [ListOrder, FilterStartDate, FilterEndDate, FilterCompany]);

  useEffect(() => {
    const DefaultDate = async () => {
      const Date = await setDate();
      if (FilterStartDate) {
        setStartDate(dayjs(FilterStartDate));
        console.log('FilterStartDate', FilterStartDate);
      } else {
        // setStartDate(dayjs(Date.StartDate));
        // console.log('Date', Date);
      }

      if (FilterEndDate) {
        setEndDate(dayjs(FilterEndDate));
        console.log('FilterEndDate', FilterEndDate);
      } else {
        // setEndDate(dayjs(Date.EndDate));
        // console.log('Date EndDate', Date);
      }
    };
    DefaultDate();
  }, []);

  const FetchData = useCallback(() => {
    if (FilterCompany.length > 0) {
      dispatch(GetSaleOS({type, Orderby: ListOrder}))
        .unwrap()
        .then(() => {
          return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
              dispatch(SetLoading(false));
              resolve();
            }, 500);
          });
        });
    }
  }, [ListOrder, FilterStartDate, FilterEndDate, FilterCompany]);

  const handleSearch = (query: string) => {
    setSearchText(query);
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = MastList.filter(item => {
      const city = item.cityname.toLowerCase();

      const name =
        UserRights == 'Owner' || UserRights == 'Agent'
          ? item.accname.toLowerCase()
          : item.compname.toLowerCase();
      return queryWords.every(
        word => name.includes(word) || city.includes(word),
      );
    });
    dispatch(SetFilterList(filteredResults));
  };

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const handleCompany = (id: number) => {
    if (!id) return;
    dispatch(SetOSCompny(id));
    console.log('id', id);
  };

  const baseOptions = {
    vertical: false,
    width: width * 0.85,
    height: normalize(80),
  } as const;

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
                // gap: 10,
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
                {type == 'sale' ? 'Recivable' : 'Payable'}
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
                onPress={() => navigation.navigate('OSListFilter', {type})}>
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
                  {StartDate ? StartDate?.format('DD/MM/YYYY') : '--/--/----'}
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
                  {EndDate ? EndDate?.format('DD/MM/YYYY') : '--/--/----'}
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

        <Carousel
          {...baseOptions}
          loop={false}
          ref={ref}
          style={{width: '100%', marginBottom: normalize(4)}}
          data={FilterCompany}
          pagingEnabled={true}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={({item, index}) => (
            <View style={{flex: 1, marginLeft: '2.5%', alignItems: 'center'}}>
              <CompanyCard
                onPress={handleCompany}
                id={item.compid}
                name={item.compyearname}
                selected={item.selected}
                total={item.totalBillAmt}
              />
            </View>
          )}
        />

        <FlatList
          // data={[]}
          data={FilterList}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <Pressable
                style={{
                  // backgroundColor: Colors.White + '80',
                  backgroundColor: Colors.backgroundSecondary,
                  paddingVertical: normalize(6),
                  paddingHorizontal: normalize(8),
                  borderRadius: 4,
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('OSData', {
                    accid: item.accid,
                    compid: item.compid,
                    city: item.cityname,
                    area: item.areaname,
                    mobile: item.mobile,
                    partyName:
                      UserRights == 'Client' ? item.compname : item.accname,
                    type,
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
                      {item.accname}
                    </RNCText>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name="home-city"
                        size={normalize(12)}
                        color={Colors.Black}
                      />
                      <RNCText size={FontSize.font10} numberOfLines={1}>
                        {item.cityname}
                      </RNCText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <FontAwesome
                        name="user-circle-o"
                        size={normalize(12)}
                        color={Colors.Black}
                      />
                      <RNCText size={FontSize.font10} numberOfLines={1}>
                        {item.areaname}
                      </RNCText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Zocial
                        name="call"
                        size={normalize(12)}
                        color={Colors.Black}
                      />

                      <RNCText size={FontSize.font10} numberOfLines={1}>
                        {item.mobile}
                      </RNCText>
                    </View>
                  </View>
                  <View style={{width: '30%', alignItems: 'flex-end'}}>
                    <RNCText family={FontFamily.Bold} size={FontSize.font12}>
                      {format(Number(item.totalbill))}
                    </RNCText>
                  </View>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{gap: 5}}
          style={{marginBottom: 10, flex: 1}}
          ListEmptyComponent={RNCNodata}
        />
      </View>
    </View>
  );
};

export default OSListScreen;

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
