import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {Datapurco, Datasaleo} from '@/Interfaces/ReportInterface';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {GetSaleOS, SetLoading, SetPartyWiseOS} from 'Reducers';
import {RNCNodata, RNCText} from 'Common';
import React, {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {OSDataPageProps} from '@/Interfaces/AppStackParamList';
import {OSView} from 'CApp';
import Zocial from 'react-native-vector-icons/Zocial';
import moment from 'moment';
import normalize from 'react-native-normalize';

const OSData = ({navigation, route}: OSDataPageProps) => {
  const {accid, compid, partyName, type, city, area, mobile} = route.params;
  const dispatch = useAppDispatch();
  const {PartyWiseOS, PartyTotal} = useAppSelector(({DBReducer}) => DBReducer);
  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(SetPartyWiseOS([]));
    });
  }, [navigation]);

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = useCallback(() => {
    dispatch(GetSaleOS({type, Orderby: 'date', id: accid}))
      .unwrap()
      .then(() => {
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            dispatch(SetLoading(false));
            resolve();
          }, 800);
        });
      });
  }, []);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.header,
          paddingVertical: isAndroid ? normalize(17) : normalize(8),
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
      </View>

      <View style={{flex: 1, padding: normalize(10), gap: 7}}>
        <View
          style={{
            backgroundColor: Colors.backgroundSecondary + 80,
            padding: normalize(5),
            borderRadius: 4,
            gap: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Ionicons
              name="business"
              size={normalize(18)}
              color={Colors.Black}
            />
            <RNCText family={FontFamily.Bold} size={FontSize.font13}>
              {partyName}
            </RNCText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                flex: 1,
              }}>
              <Zocial name="call" size={normalize(18)} color={Colors.Black} />
              <RNCText size={FontSize.font13}>{mobile}</RNCText>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                flex: 1,
              }}>
              <MaterialCommunityIcons
                name="home-city"
                size={normalize(18)}
                color={Colors.Black}
              />
              <RNCText size={FontSize.font13}>{city}</RNCText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                flex: 1,
              }}>
              <MaterialCommunityIcons
                name="home-city"
                size={normalize(18)}
                color={Colors.Black}
              />
              <RNCText size={FontSize.font13}>{area}</RNCText>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.backgroundSecondary + 80,
            borderRadius: 4,
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
              Bal. Amount
            </RNCText>
          </View>
          <View
            style={{
              width: '30%',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <RNCText size={FontSize.font12} family={FontFamily.Bold}>
              Run Bal.
            </RNCText>
          </View>
        </View>

        {type === 'sale' ? (
          <FlatList
            data={PartyWiseOS as Datasaleo[]}
            showsVerticalScrollIndicator={false}
            renderItem={({index, item}) => (
              <OSView
                index={index}
                item={item}
                separators={{
                  highlight: () => {},
                  unhighlight: () => {},
                  updateProps: (
                    select: 'leading' | 'trailing',
                    newProps: any,
                  ) => {},
                }}
              />
            )}
            contentContainerStyle={{gap: 5}}
            style={{marginBottom: 10, flex: 1}}
            ListEmptyComponent={RNCNodata}
          />
        ) : (
          <FlatList
            data={PartyWiseOS as Datapurco[]}
            showsVerticalScrollIndicator={false}
            renderItem={({index, item}) => (
              <OSView
                index={index}
                item={item}
                separators={{
                  highlight: () => {},
                  unhighlight: () => {},
                  updateProps: (
                    select: 'leading' | 'trailing',
                    newProps: any,
                  ) => {},
                }}
              />
            )}
            contentContainerStyle={{gap: 5}}
            style={{marginBottom: 10, flex: 1}}
            ListEmptyComponent={RNCNodata}
          />
        )}

        <View
          style={{
            backgroundColor: Colors.backgroundSecondary + 80,
            borderRadius: 4,
            padding: normalize(5),
            gap: 5,
          }}>
          <View style={styles.totalRows}>
            <RNCText style={styles.totalTitle}>
              Bill Amt :{' '}
              <RNCText style={styles.totalAmt}>
                {format(PartyTotal.TotalBillAmt)}
              </RNCText>
            </RNCText>
            <RNCText style={styles.totalTitle}>
              Return Amt :{' '}
              <RNCText style={styles.totalAmt}>
                {format(PartyTotal.TotalReturnAmt)}
              </RNCText>
            </RNCText>
          </View>
          <View style={styles.totalRows}>
            <RNCText style={styles.totalTitle}>
              Prevrec Amt :{' '}
              <RNCText size={FontSize.font12} family={FontFamily.Bold}>
                {format(PartyTotal.TotalPrevrecAmt)}
              </RNCText>
            </RNCText>
            <RNCText style={[styles.totalTitle]}>
              Rec Amt :{' '}
              <RNCText style={styles.totalAmt}>
                {format(PartyTotal.TotalRecAmt)}
              </RNCText>
            </RNCText>
          </View>
          <View style={styles.totalRows}>
            <RNCText style={styles.totalTitle}>
              Bal Amt :{' '}
              <RNCText size={FontSize.font12} family={FontFamily.Bold}>
                {format(PartyTotal.TotalBalAmt)}
              </RNCText>
            </RNCText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OSData;

const styles = StyleSheet.create({
  totalRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalTitle: {
    width: '48%',
    fontSize: FontSize.font12,
  },
  totalAmt: {fontSize: FontSize.font12, fontFamily: FontFamily.Bold},
});
