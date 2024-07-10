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
import {RNCNodata, RNCText} from 'Common';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import {ColdListPageProps} from '@/Interfaces/AppStackParamList';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {GetColdList} from 'Reducers';
import normalize from 'react-native-normalize';

const ColdList = ({navigation, route}: ColdListPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();

  const {LotWiseList, MastColdList, FilterColdList} = useAppSelector(
    ({DBReducer}) => DBReducer,
  );
  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    dispatch(GetColdList({type: type}));
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
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />

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
                {type == 'lot' ? 'Lotwise Stock' : 'Accountwise Stock'}
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
                // onPress={() => navigation.navigate('OSListFilter', {type})}
              >
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
              >
                <FontAwesome5
                  name="sort-alpha-up"
                  size={normalize(20)}
                  color={Colors.WText}
                />
                {/* {OrderByVisible && (
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
                )} */}
              </Pressable>
            </View>
          </>
        )}
      </View>

      <View style={{flex: 1, padding: normalize(10)}}>
        <FlatList
          data={FilterColdList}
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
                <RNCText>{type == 'lot' ? item.lotno : item.accname}</RNCText>
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
