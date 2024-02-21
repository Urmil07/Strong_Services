import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {
  GetPartyWisePurchOS,
  GetPartyWiseSaleOS,
  SetPartyWiseOS,
  SetPartyWisePurchOS,
} from 'Reducers';
import {OSDataPageProps} from '@/Interfaces/AppStackParamList';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import normalize from 'react-native-normalize';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {RNCText} from 'Common';
import moment from 'moment';

const OSData = ({navigation, route}: OSDataPageProps) => {
  const {accid, compid, partyName, type} = route.params;
  const dispatch = useAppDispatch();
  const {PartyWiseOS, PartyWisePurchOS} = useAppSelector(
    ({DBReducer}) => DBReducer,
  );
  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(SetPartyWiseOS([]));
      dispatch(SetPartyWisePurchOS([]));
    });
  }, [navigation]);

  useEffect(() => {
    if (type == 'sale') {
      dispatch(GetPartyWiseSaleOS(route.params));
    } else {
      dispatch(GetPartyWisePurchOS(route.params));
    }
  }, []);

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
            Out Standing
          </RNCText>
        </View>
        <View />
      </View>

      <View style={{flex: 1, padding: normalize(10), gap: 7}}>
        <View
          style={{
            backgroundColor: Colors.backgroundSecondary + 80,
            padding: normalize(5),
            borderRadius: 8,
          }}>
          <RNCText family={FontFamily.Bold} size={FontSize.font12}>
            {partyName}
          </RNCText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.backgroundSecondary + 80,
            borderRadius: 8,
            padding: normalize(5),
          }}>
          <View
            style={{
              width: '40%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <RNCText></RNCText>
          </View>
          <View
            style={{
              width: '30%',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <RNCText size={FontSize.font12} family={FontFamily.Bold}>
              Bill Amount
            </RNCText>
          </View>
          <View
            style={{
              width: '30%',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <RNCText size={FontSize.font12} family={FontFamily.Bold}>
              Bal. Amount
            </RNCText>
          </View>
        </View>

        {type === 'sale' ? (
          <FlatList
            data={PartyWiseOS}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: Colors.backgroundSecondary,
                    paddingVertical: normalize(6),
                    paddingHorizontal: normalize(8),
                    borderRadius: 8,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                      {moment(item.invdate).format('DD/MM/YYYY')}
                    </RNCText>
                    <RNCText family={FontFamily.Black} size={FontSize.font18}>
                      ﹒
                    </RNCText>
                    <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                      {item.bookname}
                    </RNCText>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '40%'}}>
                      <RNCText size={FontSize.font11}>
                        Due Days :{' '}
                        <RNCText size={FontSize.font11}>{item.days}</RNCText>
                      </RNCText>
                    </View>
                    <View
                      style={{
                        width: '30%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}>
                      <RNCText
                        size={FontSize.font12}
                        family={FontFamily.SemiBold}>
                        {format(Number(item.billamt))}
                      </RNCText>
                    </View>
                    <View
                      style={{
                        width: '30%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}>
                      <RNCText
                        size={FontSize.font12}
                        family={FontFamily.SemiBold}>
                        {format(Number(item.balamt))}
                      </RNCText>
                    </View>
                  </View>
                </View>
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
        ) : (
          <FlatList
            data={PartyWisePurchOS}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: Colors.backgroundSecondary,
                    paddingVertical: normalize(6),
                    paddingHorizontal: normalize(8),
                    borderRadius: 8,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                      {moment(item.invdate).format('DD/MM/YYYY')}
                    </RNCText>
                    <RNCText family={FontFamily.Black} size={FontSize.font18}>
                      ﹒
                    </RNCText>
                    <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                      {item.bookname}
                    </RNCText>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '40%'}}>
                      <RNCText size={FontSize.font11}>
                        Due Days :{' '}
                        <RNCText size={FontSize.font11}>{item.days}</RNCText>
                      </RNCText>
                    </View>
                    <View
                      style={{
                        width: '30%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}>
                      <RNCText
                        size={FontSize.font12}
                        family={FontFamily.SemiBold}>
                        {format(Number(item.billamt))}
                      </RNCText>
                    </View>
                    <View
                      style={{
                        width: '30%',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}>
                      <RNCText
                        size={FontSize.font12}
                        family={FontFamily.SemiBold}>
                        {format(Number(item.balamt))}
                      </RNCText>
                    </View>
                  </View>
                </View>
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
        )}
      </View>
    </View>
  );
};

export default OSData;

const styles = StyleSheet.create({});
