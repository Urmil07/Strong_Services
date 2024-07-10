import {Colors, FontFamily, FontSize} from '@Constants';
import {Dialog, Portal} from 'react-native-paper';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  GetStockSummary,
  setStockSummary,
  useAppStore,
  useReportStore,
} from '@Actions';
import {RNCButton, RNCNodata, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect, useState} from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {StockSummListPageProps} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';

const StockSummList: FC<StockSummListPageProps> = ({navigation}) => {
  const OrderBy = [
    {label: 'Name', value: 'name'},
    {label: 'City', value: 'city'},
    {label: 'Date', value: 'date'},
    {label: 'Month', value: 'month'},
    {label: 'Subschedule', value: 'subschedule'},
  ];

  const {FilterStockSummary} = useReportStore();
  const {UserRights} = useAppStore();
  const [ListOrder, setListOrder] = useState<string>('name');
  const [visible, setVisible] = useState(false);

  const handleMenu = () => setVisible(!visible);

  // {"accid": 35948, "accname": "BISMARCK INDUSTRIES OPC PVT LTD", "compid": 2052, "compname": "PATEL WAREHOUSING CORPORATION", "totalBalQty": 2240, "totalBalWeight": 56000}
  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        shouldShowHintSearchIcon: false,
        headerIconColor: Colors.WText,
        textColor: Colors.WText,
        tintColor: Colors.WText,
        onChangeText(e) {
          handleSearch(e.nativeEvent.text);
        },
      },
    });
  }, [navigation, FilterStockSummary]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Stock Summary',
      headerStyle: {
        backgroundColor: Colors.header,
      },
      headerTintColor: Colors.WText,
      headerTitleStyle: {fontFamily: FontFamily.SemiBold},

      headerRight: () => (
        <View style={{gap: 10, flexDirection: 'row'}}>
          <Pressable onPress={() => navigation.navigate('StockSummFilter')}>
            <FontAwesome5
              name="filter"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
          <Pressable>
            <FontAwesome5
              name="sort-alpha-up"
              size={normalize(20)}
              color={Colors.WText}
            />
          </Pressable>
        </View>
      ),
      headerBackTitleVisible: false,
      headerTransparent: false,
    });
  }, [navigation]);

  useEffect(() => {
    GetStockSummary();
  }, []);

  const handleSearch = (query: string) => {
    const queryWords = query.toLowerCase().split(' ');

    // const filteredResults = MasterSaleAccountList.filter(item => {
    //   const name = item.accname.toLowerCase();

    //   // const name =
    //   //   UserRights == 'Owner' || UserRights == 'Agent'
    //   //     ? item.accname.toLowerCase()
    //   //     : item.compname.toLowerCase();
    //   return queryWords.every(word => name.includes(word));
    // });
    // setFilterSaleAccountList(filteredResults);
    // dispatch(SetFilterList(filteredResults));
  };

  // TODO: Add Shorting (Name, BalQty, BalWt)
  return (
    <View style={styles.container}>
      <FlatList
        data={FilterStockSummary}
        renderItem={({item, index}) => {
          return (
            <Pressable
              style={{
                backgroundColor: Colors.backgroundSecondary,
                paddingVertical: normalize(8),
                paddingHorizontal: normalize(8),
                borderRadius: 4,
                justifyContent: 'center',
              }}
              onPress={() =>
                navigation.navigate('StockSummDetail', {
                  detail: item,
                })
              }>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RNCText
                  numberOfLines={2}
                  family={FontFamily.Bold}
                  size={FontSize.font11}>
                  <RNCText family={FontFamily.Bold} size={FontSize.font13}>
                    {UserRights == 'Owner' || UserRights == 'Agent'
                      ? item.accname
                      : UserRights == 'Client' && item.compname}
                  </RNCText>
                </RNCText>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <RNCText
                  numberOfLines={2}
                  family={FontFamily.Bold}
                  size={FontSize.font11}>
                  {`BalQty: ${item.totalBalQty}`}
                </RNCText>

                <RNCText
                  numberOfLines={2}
                  family={FontFamily.Bold}
                  size={FontSize.font11}>
                  {`BalWt: ${item.totalBalWeight}`}
                </RNCText>
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={{gap: 5}}
        // style={{marginBottom: 10}}
        bounces={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={500}
        updateCellsBatchingPeriod={500}
        initialNumToRender={200}
        windowSize={200}
        showsVerticalScrollIndicator={false}
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
            {OrderBy.map(order => (
              <Pressable
                style={{
                  backgroundColor: Colors.background,
                  padding: normalize(10),
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setListOrder(order.value);
                  handleMenu();
                }}>
                <RNCText>{order.label}</RNCText>
              </Pressable>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

export default StockSummList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(6),
  },
});
