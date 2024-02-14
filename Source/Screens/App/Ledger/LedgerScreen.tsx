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
import {GetLedger, SetPartyWiseLedger} from 'Reducers';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import normalize from 'react-native-normalize';
import {LedgerScreenPageProps} from '@/Interfaces/AppStackParamList';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {RNCText} from 'Common';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Functions} from '@Utils';
import {useIsFocused} from '@react-navigation/native';

const LedgerScreen = ({navigation}: LedgerScreenPageProps) => {
  const dispatch = useAppDispatch();
  const {FilterLedger} = useAppSelector(({DBReducer}) => DBReducer);
  const focused = useIsFocused();
  const [UserType, setUserType] = useState('');

  useEffect(() => {
    if (focused) dispatch(SetPartyWiseLedger([]));
  }, [focused]);

  useEffect(() => {
    dispatch(GetLedger());
    InitData();
  }, []);

  const InitData = async () => {
    const User = await Functions.getUser();
    if (User?.entryrights == 'Owner') {
      setUserType('OWNER');
    } else if (User?.acctype == 'SALES') {
      setUserType('CLIENT');
    }
  };

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const [SearchEnable, setSearchEnable] = useState(false);
  const [SearchText, setSearchText] = useState('');

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
                Account Ledger
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
        }}>
        <FlatList
          data={FilterLedger}
          // keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <Pressable
                style={{
                  backgroundColor: Colors.White + '80',
                  paddingVertical: normalize(6),
                  paddingHorizontal: normalize(8),
                  borderRadius: 6,
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

const styles = StyleSheet.create({});
