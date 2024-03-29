import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RNCNodata, RNCText} from 'Common';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import {ColdListPageProps} from '@/Interfaces/AppStackParamList';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {GetLotWiseColdList} from 'Reducers';
import normalize from 'react-native-normalize';

const ColdList = ({navigation, route}: ColdListPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();

  const {LotWiseList} = useAppSelector(({DBReducer}) => DBReducer);
  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(GetLotWiseColdList());
  }, []);

  const handleSearch = (query: string) => {
    setSearchText(query);
    const queryWords = query.toLowerCase().split(' ');
    // UserType == 'OWNER'

    // const filteredResults = MastLedger.filter(item => {
    //   const city = item.cityname.toLowerCase();
    //   const name = item.party.toLowerCase();

    //   return queryWords.every(
    //     word => name.includes(word) || city.includes(word),
    //   );
    // });
    // dispatch(SetFilterLedger(filteredResults));
  };

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
            <View
              style={{
                width: '70%',
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
                {type == 'lot'
                  ? 'Lot Wise Report'
                  : type == 'account'
                  ? 'Account Wise Report'
                  : type == 'summary'
                  ? 'Stock Summary Report'
                  : null}
              </RNCText>
            </>
          )}
        </View>
        <View style={{padding: normalize(8), flexDirection: 'row', gap: 8}}>
          <Pressable
            style={{padding: normalize(10)}}
            onPress={() => setSearchEnable(!SearchEnable)}>
            <FontAwesome5Icon
              name="search"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
          <Pressable
            style={{padding: normalize(10)}}
            // onPress={() => navigation.navigate('OSListFilter')}
          >
            <FontAwesome5Icon
              name="filter"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
        </View>
      </View>

      <View style={{flex: 1, padding: normalize(10)}}>
        <FlatList
          data={LotWiseList}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  backgroundColor: Colors.White + '80',
                  paddingVertical: normalize(6),
                  paddingHorizontal: normalize(8),
                  borderRadius: 8,
                  justifyContent: 'center',
                }}>
                <RNCText>{item.lotno}</RNCText>
              </View>
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

export default ColdList;

const styles = StyleSheet.create({});
