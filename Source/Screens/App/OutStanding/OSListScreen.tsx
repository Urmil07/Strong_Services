import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {
  GetPurchaseOS,
  GetSaleOS,
  SetApplyFilter,
  SetFilterList,
} from 'Reducers';
import {Colors, FontFamily, FontSize, isAndroid, width} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {OSListScreenPageProps} from '@/Interfaces/AppStackParamList';
import {Functions} from '@Utils';
import {useIsFocused} from '@react-navigation/native';
import {CompanyCard, DatePickerModal} from 'CApp';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import dayjs, {Dayjs} from 'dayjs';
import Animated, {
  SlideInUp,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

const OrderBy = [
  {label: 'Name', value: 'name'},
  {label: 'City', value: 'city'},
  {label: 'Date', value: 'date'},
];

const OSListScreen = ({navigation, route}: OSListScreenPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();
  const {FilterList, MastList, ApplyFilter} = useAppSelector(
    ({DBReducer}) => DBReducer,
  );
  const focused = useIsFocused();
  const ref = React.useRef<ICarouselInstance>(null);

  const [UserType, setUserType] = useState('');
  const [ListOrder, setListOrder] = useState('name');
  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');
  const [Selected, setSelected] = useState(true);
  const [data, setData] = React.useState([...new Array(6).keys()]);
  const [StartDate, setStartDate] = useState<Dayjs>(dayjs());
  const [EndDate, setEndDate] = useState<Dayjs>(dayjs());
  const [SelectedDate, setSelectedDate] = useState<Dayjs>();
  const [OrderByVisible, setOrderByVisible] = useState(false);
  const [DateVisible, setDateVisible] = useState(false);

  const InitData = async () => {
    const User = await Functions.getUser();
    if (User?.entryrights == 'Owner') {
      setUserType('OWNER');
    } else if (User?.acctype == 'SALES') {
      setUserType('CLIENT');
    }
  };

  useEffect(() => {
    if (focused && ApplyFilter) {
      FetchData();
      dispatch(SetApplyFilter(false));
    }
  }, [focused]);

  useEffect(() => {
    FetchData();
    InitData();
  }, [ListOrder]);

  const FetchData = () => {
    if (type == 'sale') dispatch(GetSaleOS({Orderby: ListOrder}));
    if (type == 'purchase') dispatch(GetPurchaseOS({Orderby: ListOrder}));
  };

  const handleSearch = (query: string) => {
    setSearchText(query);
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = MastList.filter(item => {
      const city = item.cityname.toLowerCase();

      const name =
        UserType == 'OWNER'
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

  const handleCompany = (id: string) => {
    console.log('id', id);
    setSelected(!Selected);
  };

  const baseOptions = {
    vertical: false,
    width: width * 0.85,
    height: normalize(125),
  } as const;

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />
      <DatePickerModal visible={false} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.header,
          paddingVertical: isAndroid ? normalize(17) : normalize(8),
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            // gap: 10,
            left: normalize(15),
          }}>
          {SearchEnable ? (
            <View
              style={{
                width: '60%',
                padding: normalize(5),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}>
              <TextInput
                style={{
                  color: Colors.WText,
                  fontFamily: FontFamily.Medium,
                  fontSize: FontSize.font18,
                  borderBottomColor: Colors.White,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  flex: 1,
                  padding: normalize(3),
                }}
                value={SearchText}
                onChangeText={handleSearch}
                placeholder="Search"
                placeholderTextColor={Colors.White}
                autoFocus
              />
              <Pressable
                onPress={() => handleSearch('')}
                style={{display: SearchText ? 'flex' : 'none'}}>
                <FontAwesome6Icon
                  name="xmark"
                  color={Colors.WText}
                  size={normalize(20)}
                />
              </Pressable>
            </View>
          ) : (
            <>
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
                {type == 'sale' ? 'Payable' : 'Recivable'}
              </RNCText>
            </>
          )}
        </View>
        <View style={{padding: normalize(10), flexDirection: 'row', gap: 4}}>
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
                  backgroundColor: Colors.backgroundSecondary,
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
                        backgroundColor: Colors.header,
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
                          color: Colors.WText,
                        },
                      ]}>
                      {item.label}
                    </RNCText>
                  </Pressable>
                ))}
              </Animated.View>
            )}
          </Pressable>
        </View>
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
              <Pressable style={styles.dateInput}>
                <RNCText size={FontSize.font12}>
                  {StartDate.format('DD/MM/YYYY')}
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
              <View style={styles.dateInput}>
                <RNCText size={FontSize.font12}>
                  {EndDate?.format('DD/MM/YYYY')}
                </RNCText>
                <Ionicons
                  name="calendar"
                  size={normalize(20)}
                  color={Colors.Black}
                />
              </View>
            </View>
          </Animated.View>
        )}

        <Carousel
          {...baseOptions}
          loop={false}
          ref={ref}
          style={{width: '100%'}}
          data={data}
          pagingEnabled={true}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={({index}) => (
            <View style={{flex: 1, marginLeft: '2.5%', alignItems: 'center'}}>
              <CompanyCard
                onPress={handleCompany}
                id={index.toString()}
                name={'Gauri Creation 22-23'}
                selected={Selected}
                total={0}
              />
            </View>
          )}
        />

        <FlatList
          data={FilterList}
          // keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <Pressable
                style={{
                  // backgroundColor: Colors.White + '80',
                  backgroundColor: Colors.backgroundSecondary,
                  paddingVertical: normalize(6),
                  paddingHorizontal: normalize(8),
                  borderRadius: 8,
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('OSData', {
                    accid: item.accid,
                    compid: item.compid,
                    partyName:
                      UserType == 'OWNER' ? item.accname : item.compname,
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
                        {item.cityname}
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
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <RNCText family={FontFamily.Bold} size={FontSize.font20}>
                No Data...
              </RNCText>
            </View>
          )}
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
