import Animated, {
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {Button, Dialog, Menu, Portal} from 'react-native-paper';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {Colors, FontFamily, FontSize, width} from '@Constants';
import {CompanyCard, ShortingDilog} from 'CApp';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {
  GetCompanys,
  GetOSData,
  setFilterOSList,
  setLoading,
  setOSCompny,
  useAppStore,
  useReportStore,
} from '@Actions';
import {RNCNodata, RNCText} from 'Common';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {OSListScreenPageProps} from '@/Interfaces/AppStackParamList';
import Zocial from 'react-native-vector-icons/Zocial';
import normalize from 'react-native-normalize';
import {useIsFocused} from '@react-navigation/native';

const OrderBy = [
  {label: 'Name', value: 'name'},
  {label: 'City', value: 'city'},
  {label: 'Date', value: 'date'},
];

const OSListScreen: FC<OSListScreenPageProps> = ({navigation, route}) => {
  const {type} = route.params;
  const ref = React.useRef<ICarouselInstance>(null);

  const {FilterCompany, MastOSList, FilterOSList} = useReportStore();
  const {UserRights} = useAppStore();

  const [CompanyIndex, setCompanyIndex] = useState(0);
  const [ListOrder, setListOrder] = useState('name');
  const [visible, setVisible] = React.useState(false);

  const handleMenu = () => setVisible(!visible);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: type == 'sale' ? 'Recivable' : 'Payable',
      headerBackTitleVisible: false,
      headerTransparent: false,
      headerRight(props) {
        return (
          <View style={{flexDirection: 'row', gap: 10}}>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: normalize(5),
              }}
              onPress={() =>
                navigation.navigate('OSListFilter', {type, ListOrder})
              }>
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
              // onPress={() => setOrderByVisible(!OrderByVisible)}
              onPress={handleMenu}>
              <FontAwesome5
                name="sort-alpha-up"
                size={normalize(20)}
                color={Colors.WText}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        shouldShowHintSearchIcon: true,
        headerIconColor: Colors.WText,
        textColor: Colors.WText,
        tintColor: Colors.WText,
        onChangeText(e) {
          handleSearch(e.nativeEvent.text);
        },
      },
    });
  }, [navigation, MastOSList, FilterOSList]);

  useEffect(() => {
    setLoading(true);
    GetCompanys({type});
    setLoading(false);
  }, []);

  useEffect(() => {
    FetchData();
  }, [ListOrder, FilterCompany]);

  const FetchData = useCallback(() => {
    if (FilterCompany.length > 0) {
      setLoading(true);
      GetOSData({type, Orderby: ListOrder});
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  }, [ListOrder, FilterCompany]);

  const handleSearch = (query: string) => {
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = MastOSList.filter(item => {
      const city = item.cityname.toLowerCase();

      const name =
        UserRights == 'Owner' || UserRights == 'Agent'
          ? item.accname.toLowerCase()
          : item.compname.toLowerCase();
      return queryWords.every(
        word => name.includes(word) || city.includes(word),
      );
    });

    setFilterOSList(filteredResults);
  };

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const handleCompany = (id: number) => {
    if (!id) return;
    setOSCompny(id);
    FetchData();
  };

  const baseOptions = {
    vertical: false,
    width: width * 0.85,
    height: normalize(80),
  } as const;

  const onContinue = () => {
    const isLastScreen = CompanyIndex === FilterCompany.length - 1;
    if (isLastScreen) setCompanyIndex(0);
    else setCompanyIndex(CompanyIndex + 1);
  };

  const onBack = () => {
    const isFirstScreen = CompanyIndex === 0;
    if (isFirstScreen) setCompanyIndex(0);
    else setCompanyIndex(CompanyIndex - 1);
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  return (
    <View style={styles.page}>
      {FilterCompany.length &&
      (UserRights == 'Owner' || UserRights == 'Agent') ? (
        <View style={{gap: 6}}>
          <GestureDetector gesture={swipes}>
            <Animated.View
              style={{alignItems: 'center'}}
              entering={SlideInRight}
              exiting={SlideOutLeft}
              key={CompanyIndex}>
              <CompanyCard
                onPress={handleCompany}
                id={FilterCompany[CompanyIndex].compid}
                name={FilterCompany[CompanyIndex].compyearname}
                selected={FilterCompany[CompanyIndex].selected}
                total={FilterCompany[CompanyIndex].totalBillAmt}
              />
            </Animated.View>
          </GestureDetector>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {FilterCompany.map((item, index) => {
              return (
                <View
                  style={{
                    height: normalize(10),
                    width: normalize(10),
                    backgroundColor:
                      index == CompanyIndex ? Colors.primary : Colors.secondary,
                    borderRadius: 100,
                  }}
                  key={index}
                />
              );
            })}
          </View>
        </View>
      ) : null}

      <FlatList
        // data={[]}
        data={FilterOSList}
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
                    {UserRights == 'Client' ? item.compname : item.accname}
                  </RNCText>
                  {UserRights !== 'Client' && (
                    <>
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
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                            width: '53%',
                          }}>
                          <FontAwesome
                            name="user-circle-o"
                            size={normalize(12)}
                            color={Colors.Black}
                          />
                          <RNCText size={FontSize.font10}>
                            {item.areaname}
                          </RNCText>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                            width: '45%',
                          }}>
                          <Zocial
                            name="call"
                            size={normalize(12)}
                            color={Colors.Black}
                          />

                          <RNCText size={FontSize.font10}>
                            {item.mobile}
                          </RNCText>
                        </View>
                      </View>
                    </>
                  )}
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
        // style={{flex: 1}}
        contentContainerStyle={{gap: 5}}
        ListEmptyComponent={RNCNodata}
      />
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={handleMenu}
          style={{
            backgroundColor: Colors.header,
            width: normalize(250),
            alignSelf: 'center',
            borderRadius: 8,
          }}>
          <Dialog.Content style={{gap: 5}}>
            {OrderBy.map((order, index) => (
              <Pressable
                style={{
                  backgroundColor:
                    ListOrder == order.value
                      ? Colors.background
                      : Colors.backgroundSecondary,
                  padding: normalize(10),
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setListOrder(order.value);
                  handleMenu();
                }}
                key={index}>
                <RNCText>{order.label}</RNCText>
              </Pressable>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          // flex: 1,
          padding: normalize(10),
          gap: 5,
          // zIndex: -1,
        }}>
        {UserRights == 'Owner' || UserRights == 'Agent' ? (
          <Carousel
            {...baseOptions}
            loop={false}
            ref={ref}
            style={{width: '100%', marginBottom: normalize(4)}}
            data={FilterCompany}
            pagingEnabled={true}
            onSnapToItem={index => console.log('current index:', index)}
            renderItem={({item, index}) => (
              <View
                style={{
                  flex: 1,
                  marginLeft: '2.5%',
                  alignItems: 'center',
                }}>
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
        ) : null}

        {/* <ShortingDilog visible={visible} handleMenu={handleMenu} /> */}

        <FlatList
          // data={[]}
          data={FilterOSList}
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
                      {UserRights == 'Client' ? item.compname : item.accname}
                    </RNCText>
                    {UserRights !== 'Client' && (
                      <>
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
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 5,
                              alignItems: 'center',
                              width: '53%',
                            }}>
                            <FontAwesome
                              name="user-circle-o"
                              size={normalize(12)}
                              color={Colors.Black}
                            />
                            <RNCText size={FontSize.font10}>
                              {item.areaname}
                            </RNCText>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 5,
                              alignItems: 'center',
                              width: '45%',
                            }}>
                            <Zocial
                              name="call"
                              size={normalize(12)}
                              color={Colors.Black}
                            />

                            <RNCText size={FontSize.font10}>
                              {item.mobile}
                            </RNCText>
                          </View>
                        </View>
                      </>
                    )}
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
          // style={{flex: 1}}
          contentContainerStyle={{gap: 5}}
          ListEmptyComponent={RNCNodata}
        />
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={handleMenu}
          style={{
            backgroundColor: Colors.header,
            width: normalize(250),
            alignSelf: 'center',
            borderRadius: 8,
          }}>
          <Dialog.Content style={{gap: 5}}>
            {OrderBy.map((order, index) => (
              <Pressable
                style={{
                  backgroundColor:
                    ListOrder == order.value
                      ? Colors.background
                      : Colors.backgroundSecondary,
                  padding: normalize(10),
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setListOrder(order.value);
                  handleMenu();
                }}
                key={index}>
                <RNCText>{order.label}</RNCText>
              </Pressable>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

export default OSListScreen;

const styles = StyleSheet.create({
  page: {flex: 1, padding: normalize(10), gap: 10},
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
