import {Colors, FontFamily, FontSize} from '@Constants';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RNCText} from 'Common';
import React from 'react';
import normalize from 'react-native-normalize';

const CompanyCard = ({
  onPress,
  name,
  id,
  total,
  selected,
}: {
  onPress: (id: number) => void;
  name: string;
  id: number;
  total: number;
  selected: boolean;
}) => {
  const {format} = new Intl.NumberFormat('hi-In', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <Pressable
      style={{
        backgroundColor: Colors.header,
        flex: 1,
        width: normalize(300),
        borderRadius: 6,
        overflow: 'hidden',
        // alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
      onPress={() => onPress(id)}>
      <View style={{flex: 1, backgroundColor: Colors.card}}>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.header,
            padding: normalize(6),
          }}>
          <View style={{width: '80%'}}>
            <RNCText
              color={Colors.WText}
              family={FontFamily.Bold}
              size={FontSize.font13}
              numberOfLines={2}>
              {name}
            </RNCText>
          </View>
          <View style={{width: '20%', alignItems: 'flex-end'}}>
            <MaterialCommunityIcons
              name="office-building"
              size={normalize(30)}
              color={Colors.WText}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: normalize(10),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: normalize(20),
              width: normalize(20),
              backgroundColor: selected ? Colors.header : Colors.transparent,
              borderColor: selected ? Colors.card : Colors.header,
              borderWidth: 1,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {selected && <FontAwesome6Icon name="check" color={Colors.WText} />}
          </View>
          <View>
            <RNCText
              color={Colors.WText}
              family={FontFamily.Bold}
              size={FontSize.font16}>
              {total > 0 ? format(total) : format(0)}
            </RNCText>
          </View>
        </View>
      </View>
      {/* <View
        style={{
          flex: 1,
          backgroundColor: Colors.card,
          padding: normalize(10),
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '80%',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <RNCText
            color={Colors.WText}
            family={FontFamily.SemiBold}
            size={FontSize.font16}
            numberOfLines={2}>
            {name}
          </RNCText>
        </View>
        <View
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons
            name="office-building"
            size={normalize(38)}
            color={Colors.WText}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          padding: normalize(10),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: normalize(20),
            width: normalize(20),
            backgroundColor: selected ? Colors.card : Colors.transparent,
            borderColor: Colors.card,
            borderWidth: 1,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {selected && <FontAwesome6Icon name="check" color={Colors.WText} />}
        </View>
        <View>
          <RNCText
            color={Colors.WText}
            family={FontFamily.Bold}
            size={FontSize.font16}>
            {total > 0 ? format(total) : format(0)}
          </RNCText>
        </View>
      </View> */}
    </Pressable>
  );
};

export default CompanyCard;

const styles = StyleSheet.create({});
