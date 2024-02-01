import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {
  Colors,
  FontFamily,
  FontSize,
  NavigationRoutes,
  width,
} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {Functions} from '@Utils';
import {useAppDispatch} from '@ReduxHook';
import {EstrongReport, SetLoading} from 'Reducers';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const CategoryData = [
    {Id: 1, Name: 'Sale OS', Total: 999999, isLoack: false},
    {Id: 2, Name: 'Purchase OS', Total: 999999, isLoack: false},
    {Id: 3, Name: 'Ledger', Total: 999999, isLoack: false},
    {Id: 4, Name: 'Lot Wise Report', Total: 999999, isLoack: false},
    {Id: 5, Name: 'Account Wise Report', Total: 999999, isLoack: false},
    {Id: 6, Name: 'Stock Summary Report', Total: 99999999, isLoack: true},
  ];
  const {format} = new Intl.NumberFormat('hi-In', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    const InitData = async () => {
      const User = await Functions.getUser();
      console.log('User', User);
      if (User?.entryrights == 'Owner') {
        dispatch(EstrongReport({EntryEmail: User?.entryemail}));
      } else if (User?.acctype == 'SALES') {
        dispatch(
          EstrongReport({EntryEmail: User?.entryemail, AccId: User?.accid}),
        );
      }
    };
    InitData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={CategoryData}
        keyExtractor={item => item.Id.toString()}
        renderItem={({index, item}) => {
          return (
            <Pressable
              style={{
                backgroundColor: Colors.secondary,
                // height: normalize(100),
                width: normalize(175),
                marginHorizontal: normalize(6),
                borderRadius: 12,
                overflow: 'hidden',
                padding: normalize(5),
                gap: 10,
              }}
              disabled={item.isLoack}
              onPress={() => navigation.navigate(NavigationRoutes.OSList)}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.White,
                }}>
                <View
                  style={{
                    width: normalize(40),
                    padding: normalize(4),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome6Icon
                    name="truck-fast"
                    color={Colors.White}
                    size={normalize(20)}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: normalize(4),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <RNCText
                    size={FontSize.font14}
                    family={FontFamily.SemiBold}
                    color={Colors.WText}
                    numberOfLines={3}>
                    {item.Name}
                  </RNCText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // height: normalize(70),
                  padding: normalize(10),
                }}>
                <View style={{flex: 1}}>
                  <RNCText
                    color={Colors.WText}
                    family={FontFamily.Bold}
                    size={FontSize.font17}>
                    {item.isLoack ? '-' : format(item.Total)}
                  </RNCText>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: Colors.E855555,
                    width: normalize(20),
                    // padding: normalize(4),
                    display: item.isLoack ? 'flex' : 'none',
                  }}>
                  <FontAwesome6Icon
                    name="lock"
                    color={Colors.White}
                    size={normalize(14)}
                  />
                </View>
              </View>
            </Pressable>
          );
        }}
        style={{marginTop: normalize(10)}}
        numColumns={2}
        contentContainerStyle={{gap: normalize(10), alignItems: 'center'}}
      />
    </View>
  );
};

export default Home;
