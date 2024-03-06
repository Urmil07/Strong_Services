import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {GetLedger, GetPartyWiseLedger, SetFilterLedgerComp} from 'Reducers';
import {RNCDropdown, RNCNodata, RNCText} from 'Common';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import {Dataledger} from '@/Interfaces/ReportInterface';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {LedgerDetailScreenPageProps} from '@/Interfaces/AppStackParamList';
import {LedgerView} from 'CApp';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import normalize from 'react-native-normalize';

const LedgerDetailScreen = ({
  navigation,
  route,
}: LedgerDetailScreenPageProps) => {
  const dispatch = useAppDispatch();
  const {accid, compid, partyName} = route.params;
  const {PartyWiseLedger, MastCompany} = useAppSelector(
    ({DBReducer}) => DBReducer,
  );
  const [OpenBal, setOpenBal] = useState<number>(0);
  const [OpenDebit, setOpenDebit] = useState<number>(0);
  const [OpenCredit, setOpenCredit] = useState<number>(0);

  const [SelectedCompny, setSelectedCompny] = useState('');

  useEffect(() => {
    if (MastCompany.length > 0) {
      setSelectedCompny(MastCompany[0]?.value);
      dispatch(SetFilterLedgerComp(MastCompany[0]?.value));
    }
  }, [MastCompany]);

  useEffect(() => {
    // dispatch(GetLedger({id: compid}));
    if (SelectedCompny)
      dispatch(
        GetPartyWiseLedger({
          party: partyName,
          accid: '',
          CompID: SelectedCompny!,
        }),
      );
  }, [SelectedCompny]);

  useEffect(() => {
    if (PartyWiseLedger.length > 0) {
      const Opennig = PartyWiseLedger.find(ledger => ledger.op !== '');
      const {balamt, dramt, cramt} = Opennig!;
      setOpenBal(balamt);
      setOpenDebit(dramt);
      setOpenCredit(cramt);
    } else {
      setOpenBal(0);
      setOpenDebit(0);
      setOpenCredit(0);
    }
  }, [PartyWiseLedger]);

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
      <SafeAreaView style={{backgroundColor: Colors.header}} />
      <StatusBar backgroundColor={Colors.header} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.header,
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
            backgroundColor: Colors.backgroundSecondary + 80,
            padding: normalize(5),
            borderRadius: 4,
          }}>
          <RNCText family={FontFamily.Bold} size={FontSize.font12}>
            {partyName}
          </RNCText>
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
              <RNCText size={FontSize.font13}>{}</RNCText>
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
              <RNCText size={FontSize.font13}>{}</RNCText>
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
              <RNCText size={FontSize.font13}>{}</RNCText>
            </View>
          </View>
        </View>

        <View>
          <RNCDropdown
            Data={MastCompany}
            value={SelectedCompny!}
            dropdownstyle={{
              paddingVertical: normalize(0),
              backgroundColor: Colors.header,
            }}
            selectedtextstyle={{fontSize: FontSize.font12, color: Colors.WText}}
            itemtextstyle={{fontSize: FontSize.font12}}
            iconstyle={{}}
            placeholderText={'Select Company...'}
            iconColor={Colors.WText}
            onChange={item => {
              setSelectedCompny(item.value);
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: Colors.backgroundSecondary + 80,
            padding: normalize(5),
            borderRadius: 4,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '35%'}}>
              <RNCText family={FontFamily.Black} size={FontSize.font12}>
                Opening Bal.
              </RNCText>
            </View>
            <View
              style={{
                width: '32.5%',
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
            <View
              style={{
                width: '32.5%',
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
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '35%'}}>
              <RNCText size={FontSize.font12} family={FontFamily.SemiBold}>
                {format(OpenBal)}
              </RNCText>
            </View>
            <View
              style={{
                width: '32.5%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <RNCText
                family={FontFamily.Bold}
                size={FontSize.font12}
                color={Colors.Danger}>
                {format(OpenDebit)}
              </RNCText>
            </View>
            <View
              style={{
                width: '32.5%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <RNCText
                family={FontFamily.Bold}
                size={FontSize.font12}
                color={Colors.EAGreen}>
                {format(OpenCredit)}
              </RNCText>
            </View>
          </View>
        </View>

        <FlatList
          data={
            PartyWiseLedger.filter(
              ledger => ledger.op == '',
            ) as LedgerDataInterfase[]
          }
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <LedgerView
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
            );
          }}
          contentContainerStyle={{gap: 5}}
          style={{marginBottom: normalize(5), flex: 1}}
          ListEmptyComponent={RNCNodata}
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
              Debit Total :{'  '}
              <RNCText
                family={FontFamily.Bold}
                size={FontSize.font12}
                color={Colors.E855555}>
                {format(DebitTotal)}
              </RNCText>
            </RNCText>
            <RNCText family={FontFamily.SemiBold} size={FontSize.font11}>
              Credit Total :{'  '}
              <RNCText
                family={FontFamily.Bold}
                size={FontSize.font12}
                color={Colors.EAGreen}>
                {format(CreditTotal)}
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
