import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {RNCStyle, RNCText, RNCTextInput, RNCView} from 'Common';
import {Colors, FontFamily, FontSize} from '@/Constants';
import normalize from 'react-native-normalize';
import {OTPPageProps} from '@/Navigation/AuthStack';

const OTP = ({navigation}: OTPPageProps) => {
  const data: {id: number}[] = [
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9},
    {id: 10},
    {id: 11},
    {id: 12},
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      marginVertical: normalize(3),
      marginHorizontal: normalize(10),
    },
    Itemcontainer: {
      borderRadius: normalize(5),
      backgroundColor: Colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      padding: normalize(3),
      justifyContent: 'space-between',
      paddingHorizontal: normalize(4),
    },
    btnContainer: {
      backgroundColor: Colors.background + 99,
      borderRadius: normalize(5),
      alignItems: 'center',
      justifyContent: 'center',
      padding: normalize(4),
      flexDirection: 'row',
      gap: 6,
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={[
          RNCStyle.HeaderContainer,
          {backgroundColor: Colors.primary, marginTop: normalize(3)},
        ]}>
        <Pressable
          style={{...RNCStyle.flexRow}}
          onPress={() => {
            navigation.goBack();
          }}>
          {/* <Icon
            name="chevron-left"
            type="material-community"
            color={Colors.White}
            size={normalize(12)}
            containerStyle={{left: normalize(2)}}
          /> */}
        </Pressable>
        <View></View>
        <View style={{right: normalize(2)}}>
          <RNCText
            color={Colors.White}
            family={FontFamily.Medium}
            size={FontSize.font7}
            align="right">
            {/* {DNow.format('ddd, DD YYYY')} */}
            Wed, 29 2023
          </RNCText>
          <RNCText
            family={FontFamily.Bold}
            size={FontSize.font17}
            color={Colors.White}
            align="right">
            11:29
            {/* {DNow.format('hh:mm')} */}
            {/* <RNCText family={FontFamily.SemiBold} color={colors.white}>
              :{DNow.format('ss')}
            </RNCText> */}
          </RNCText>
        </View>
      </View>

      <View style={styles.container}>
        <View style={{flex: 0.7}}>
          <View
            style={{flex: 1, borderRadius: normalize(5), overflow: 'hidden'}}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.Itemcontainer}>
                  <View>
                    <RNCText size={FontSize.font8} family={FontFamily.Bold}>
                      Converse Golliraz 43 X 1 - {item.id}
                    </RNCText>
                    <View style={{flexDirection: 'row', gap: 15}}>
                      <RNCText size={FontSize.font8}>₹65.95</RNCText>
                      <View
                        style={{
                          gap: 5,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <RNCText size={FontSize.font8}>-10%</RNCText>
                        {/* <Icon
                          name="ticket-percent-outline"
                          type="material-community"
                          size={normalize(8)}
                          color={Colors.EAGreen}
                        /> */}
                      </View>
                    </View>
                  </View>

                  <View style={styles.btnContainer}>
                    {/* <Icon
                      name="plus-circle"
                      type="material-community"
                      color={Colors.EAGreen}
                      size={normalize(10)}
                    /> */}
                    <View
                      style={{
                        width: normalize(17),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <RNCText size={FontSize.font8}>999</RNCText>
                    </View>
                    {/* <Icon
                      name="minus-circle"
                      type="material-community"
                      color={Colors.Danger}
                      size={normalize(10)}
                    /> */}
                  </View>
                </View>
              )}
              contentContainerStyle={{gap: 6}}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={{flex: 1}}></View>
      </View>
    </SafeAreaView>
  );
};

export default OTP;
