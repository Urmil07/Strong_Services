import {Colors, FontFamily, FontSize} from '@Constants';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from 'react';
import {
  getOrders,
  getSaleAccounts,
  getSaleData,
  setFilterSaleAccountList,
  setLoading,
  useSaleStore,
} from '@Actions';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {RNCText} from 'Common';
import {SaleHomePageProps} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';

const SaleHome: FC<SaleHomePageProps> = ({navigation}) => {
  const {MasterSaleAccountList, OrderList} = useSaleStore();
  const [isPending, startTransition] = useTransition();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Sale',
      headerBackTitleVisible: false,
      headerTransparent: false,
      headerSearchBarOptions: {
        shouldShowHintSearchIcon: false,
        headerIconColor: Colors.WText,
        textColor: Colors.WText,
        tintColor: Colors.WText,
        onChangeText(e) {
          handleSearch(e.nativeEvent.text);
        },
      },
      headerRight: () => (
        <View style={{gap: 10, flexDirection: 'row'}}>
          <Pressable>
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
    });
  }, [navigation]);

  useEffect(() => {
    startTransition(() => {
      getOrders().finally(() => getSaleData());
      // .finally(() => setLoading(false));
    });

    // getSaleAccounts();
  }, []);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const handleSearch = (query: string) => {
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = MasterSaleAccountList.filter(item => {
      const name = item.accname.toLowerCase();

      // const name =
      //   UserRights == 'Owner' || UserRights == 'Agent'
      //     ? item.accname.toLowerCase()
      //     : item.compname.toLowerCase();
      return queryWords.every(word => name.includes(word));
    });
    setFilterSaleAccountList(filteredResults);
    // dispatch(SetFilterList(filteredResults));
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <FlatList
          data={OrderList}
          renderItem={({item, index}) => (
            <Pressable style={styles.card} onPress={() => null}>
              <RNCText style={styles.cardTitle}>{item.AccName}</RNCText>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <RNCText style={styles.cardText}>
                  Ord Id:{' '}
                  <RNCText style={styles.cardText} family={FontFamily.SemiBold}>
                    {item.UniqNumber}
                  </RNCText>
                </RNCText>
                <RNCText style={styles.cardText}>
                  Ord Date:{' '}
                  <RNCText style={styles.cardText} family={FontFamily.SemiBold}>
                    {item.OrdDate}
                  </RNCText>
                </RNCText>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '70%'}}>
                  <RNCText style={styles.cardText}>
                    Agent:{' '}
                    <RNCText
                      style={styles.cardText}
                      family={FontFamily.SemiBold}>
                      {item.AgentName}
                    </RNCText>
                  </RNCText>
                </View>
                <View style={{width: '30%'}}>
                  <RNCText style={styles.cardText}>
                    AMT:{' '}
                    <RNCText style={styles.cardText} family={FontFamily.Bold}>
                      {format(item.Gamt)}
                    </RNCText>
                  </RNCText>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.bottomBtn, {backgroundColor: Colors.transparent}]}>
          <RNCText family={FontFamily.Bold}>Submit Order</RNCText>
        </Pressable>
        <Pressable
          style={styles.bottomBtn}
          onPress={() => navigation.navigate('OrderConfig')}>
          <RNCText family={FontFamily.Bold} color={Colors.WText}>
            New Order
          </RNCText>
        </Pressable>
      </View>
      <SafeAreaView />
    </View>
  );
};

export default SaleHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
  },
  bottomContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  bottomBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.header,
    backgroundColor: Colors.header,
    padding: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    padding: normalize(8),
    gap: 3,
  },
  cardTitle: {
    fontSize: FontSize.font12,
    fontFamily: FontFamily.Bold,
  },
  cardText: {
    fontSize: FontSize.font10,
  },
});
