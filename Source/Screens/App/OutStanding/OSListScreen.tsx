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
import {GetPurchaseOS, GetSaleOS, SetApplyFilter} from 'Reducers';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCDropdown, RNCText} from 'Common';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {OSListScreenPageProps} from '@/Interfaces/AppStackParamList';
import {Functions} from '@Utils';
import {useIsFocused} from '@react-navigation/native';

const OrderBy = [
  {label: 'Name', value: 'name'},
  {label: 'City', value: 'city'},
  {label: 'Date', value: 'date'},
];

const OSListScreen = ({navigation, route}: OSListScreenPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();
  const {FilterList, ApplyFilter} = useAppSelector(({DBReducer}) => DBReducer);
  const focused = useIsFocused();

  const [UserType, setUserType] = useState('');
  const [ListOrder, setListOrder] = useState('name');
  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');

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

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.card}} />
      <StatusBar backgroundColor={Colors.card} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.card,
          paddingVertical: isAndroid ? normalize(10) : 0,
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            left: normalize(15),
          }}>
          {SearchEnable ? (
            <View style={{width: '70%', padding: normalize(5)}}>
              <TextInput
                style={{
                  color: Colors.WText,
                  fontFamily: FontFamily.Medium,
                  fontSize: FontSize.font18,
                  borderBottomColor: Colors.White,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderRadius: 8,
                }}
                onChangeText={text => setSearchText(text)}
                placeholder="Search"
                placeholderTextColor={Colors.White}
              />
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
                {type == 'sale' ? 'Sale' : 'Purchase'} Out Standing
              </RNCText>
            </>
          )}
        </View>
        <View style={{padding: normalize(8), flexDirection: 'row', gap: 8}}>
          <Pressable
            style={{padding: normalize(10)}}
            onPress={() => setSearchEnable(!SearchEnable)}>
            <FontAwesome5
              name="search"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
          <Pressable
            style={{padding: normalize(10)}}
            onPress={() => navigation.navigate('OSListFilter')}>
            <FontAwesome5
              name="filter"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          padding: normalize(10),
          gap: 5,
        }}>
        <View
          style={{
            // backgroundColor: Colors.White + 50,
            borderRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <RNCText size={FontSize.font13} family={FontFamily.Bold}>
              Order By :
            </RNCText>
            <RNCDropdown
              Data={OrderBy}
              value={'name'}
              placeholderText={'Order By'}
              style={{width: '35%'}}
              onChange={text => {
                setListOrder(text.value);
              }}
              dropdownstyle={{paddingVertical: normalize(2)}}
            />
          </View>
        </View>
        <FlatList
          data={FilterList}
          // keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <Pressable
                style={{
                  backgroundColor: Colors.White + '80',
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
                    <RNCText size={FontSize.font10} numberOfLines={1}>
                      {item.cityname}
                    </RNCText>
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

const styles = StyleSheet.create({});
