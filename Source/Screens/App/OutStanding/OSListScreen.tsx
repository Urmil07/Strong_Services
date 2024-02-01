import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {GetSaleOS} from 'Reducers';
import {SafeAreaView} from 'react-native';
import {Colors} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';

const OSListScreen = () => {
  const dispatch = useAppDispatch();
  const {SaleOS} = useAppSelector(({DBReducer}) => DBReducer);
  console.log('SaleOS', SaleOS);
  useEffect(() => {
    dispatch(GetSaleOS());
  }, []);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 10}}>
        <FlatList
          data={SaleOS}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <Pressable
                style={{
                  backgroundColor: Colors.N00ADEE,
                  padding: normalize(8),
                  borderRadius: 6,
                  height: normalize(60),
                  justifyContent: 'center',
                }}
                onPress={() => console.log('item.accid', item.accid)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <RNCText style={{width: '70%'}} numberOfLines={2}>
                    {item.accname}
                  </RNCText>
                  <RNCText>{format(Number(item.totalbill))}</RNCText>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{gap: 10}}
        />
      </View>
    </SafeAreaView>
  );
};

export default OSListScreen;

const styles = StyleSheet.create({});
