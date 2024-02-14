import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {RNCText} from 'Common';
import normalize from 'react-native-normalize';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {LedgerDetailScreenPageProps} from '@/Interfaces/AppStackParamList';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {GetPartyWiseLedger} from 'Reducers';
import moment from 'moment';

const LedgerDetailScreen = ({
  navigation,
  route,
}: LedgerDetailScreenPageProps) => {
  const dispatch = useAppDispatch();
  const {accid, compid, partyName} = route.params;
  const {PartyWiseLedger} = useAppSelector(({DBReducer}) => DBReducer);

  useEffect(() => {
    dispatch(GetPartyWiseLedger(route.params));
  }, []);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const CreditTotal = PartyWiseLedger?.reduce(
    (acc, curr) => Number(acc) + Number(curr.cramt),
    0,
  );

  const DebitTotal = PartyWiseLedger?.reduce(
    (acc, curr) => Number(acc) + Number(curr.dramt),
    0,
  );

  const ClosingBal = Math.abs(CreditTotal - DebitTotal);

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
            Account Ledger
          </RNCText>
        </View>
        <View />
      </View>

      <View
        style={{
          flex: 1,
          padding: normalize(10),
          gap: 5,
        }}>
        <View
          style={{
            backgroundColor: Colors.White + 50,
            padding: normalize(5),
            borderRadius: 8,
          }}>
          <RNCText family={FontFamily.SemiBold}>{partyName}</RNCText>
        </View>

        <View
          style={{
            backgroundColor: Colors.White + 50,
            padding: normalize(5),
            borderRadius: 8,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}} />
            <View
              style={{
                width: '30%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <RNCText
                family={FontFamily.Black}
                size={FontSize.font12}
                color={Colors.EAGreen}>
                Credit
              </RNCText>
            </View>
            <View
              style={{
                width: '30%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <RNCText
                family={FontFamily.Black}
                size={FontSize.font12}
                color={Colors.Danger}>
                Debit
              </RNCText>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}}>
              <RNCText>Opening Balance</RNCText>
            </View>
            <View
              style={{
                width: '30%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <RNCText family={FontFamily.Bold} size={FontSize.font12}>
                Credit
              </RNCText>
            </View>
            <View
              style={{
                width: '30%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <RNCText family={FontFamily.Bold} size={FontSize.font12}>
                Debit
              </RNCText>
            </View>
          </View>
        </View>

        <FlatList
          data={PartyWiseLedger}
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '40%'}}>
                    <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                      {moment(item.ldate).format('DD/MM/YYYY')}
                    </RNCText>
                  </View>
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <RNCText
                      color={Colors.EAGreen}
                      size={FontSize.font12}
                      family={FontFamily.Bold}>
                      {item.cramt > 0 ? format(Number(item.cramt)) : ''}
                    </RNCText>
                  </View>
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <RNCText
                      color={Colors.E855555}
                      size={FontSize.font12}
                      family={FontFamily.Bold}>
                      {item.dramt > 0 ? format(Number(item.dramt)) : ''}
                    </RNCText>
                  </View>
                </View>
                <RNCText family={FontFamily.SemiBold} size={FontSize.font11}>
                  {item.narration}
                </RNCText>
              </View>
            );
          }}
          contentContainerStyle={{gap: 5}}
          style={{marginBottom: normalize(5), flex: 1}}
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

        <View
          style={{
            backgroundColor: Colors.White + 40,
            padding: normalize(10),
            borderRadius: 8,
            marginBottom: normalize(10),
            gap: 3,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RNCText family={FontFamily.SemiBold} size={FontSize.font11}>
              Credit Total :{'  '}
              <RNCText
                family={FontFamily.Bold}
                size={FontSize.font12}
                color={Colors.EAGreen}>
                {format(CreditTotal)}
              </RNCText>
            </RNCText>
            <RNCText family={FontFamily.SemiBold} size={FontSize.font11}>
              Debit Total :{'  '}
              <RNCText
                family={FontFamily.Bold}
                size={FontSize.font12}
                color={Colors.E855555}>
                {format(DebitTotal)}
              </RNCText>
            </RNCText>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{width: '60%'}}>
              <RNCText family={FontFamily.Bold}>Closing Balance</RNCText>
            </View>
            <View
              style={{
                width: '40%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <RNCText
                family={FontFamily.Bold}
                color={
                  CreditTotal > DebitTotal ? Colors.EAGreen : Colors.E855555
                }>
                {`${format(ClosingBal)} ${
                  CreditTotal > DebitTotal ? 'Cr' : 'Dr'
                }`}
              </RNCText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LedgerDetailScreen;

const styles = StyleSheet.create({});
