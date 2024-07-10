import {} from 'Reducers';

import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {Colors, FontFamily, FontSize} from '@Constants';
import {Dialog, Portal} from 'react-native-paper';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {
  GetLedger,
  GetLedgerFilterData,
  setFilterLedger,
  setLoading,
  useAppStore,
  useReportStore,
} from '@Actions';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {LedgerScreenPageProps} from '@/Interfaces/AppStackParamList';
import {RNCText} from 'Common';
import normalize from 'react-native-normalize';

const OrderBy = [
  {label: 'Name', value: 'name'},
  {label: 'City', value: 'city'},
  {label: 'Date', value: 'date'},
  {label: 'Month', value: 'month'},
  {label: 'Subschedule', value: 'subschedule'},
];

const LedgerScreen: FC<LedgerScreenPageProps> = ({navigation}) => {
  const {MastLedger, FilterLedger} = useReportStore();
  const [ListOrder, setListOrder] = useState<string>('name');
  const [visible, setVisible] = React.useState(false);

  const {UserRights} = useAppStore();

  const handleMenu = () => setVisible(!visible);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Ledger',
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
              onPress={() => navigation.navigate('LedgerFilter', {ListOrder})}>
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
        hideWhenScrolling: false,
        shouldShowHintSearchIcon: false,
        headerIconColor: Colors.WText,
        textColor: Colors.WText,
        tintColor: Colors.WText,
        onChangeText(e) {
          handleSearch(e.nativeEvent.text);
        },
      },
    });
  }, [navigation, MastLedger, FilterLedger]);

  useEffect(() => {
    InitData();
  }, [ListOrder]);

  const InitData = useCallback(async () => {
    setLoading(true);
    GetLedger({Orderby: ListOrder});
    await GetLedgerFilterData();

    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [ListOrder]);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const handleSearch = (query: string) => {
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = MastLedger.filter(item => {
      const city = item.cityname.toLowerCase();
      const name = item.party.toLowerCase();

      return queryWords.every(
        word => name.includes(word) || city.includes(word),
      );
    });
    setFilterLedger(filteredResults);
  };

  return (
    <View style={{flex: 1, padding: normalize(10)}}>
      <FlatList
        data={FilterLedger}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <Pressable
              style={{
                backgroundColor: Colors.backgroundSecondary,
                paddingVertical: normalize(6),
                paddingHorizontal: normalize(8),
                borderRadius: 4,
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
                    {/* FIXME: Get Company name and set When UserRights == 'Client' */}
                    {UserRights == 'Owner' || UserRights == 'Agent'
                      ? item.party
                      : UserRights == 'Client' && item.compid}
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
};

export default LedgerScreen;
