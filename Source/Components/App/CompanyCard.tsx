import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, FontFamily, FontSize} from '@Constants';
import normalize from 'react-native-normalize';
import {RNCText} from 'Common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const CompanyCard = ({
  onPress,
  name,
  id,
  total,
  selected,
}: {
  onPress: (id: string) => void;
  name: string;
  id: string;
  total: number;
  selected: boolean;
}) => {
  return (
    <Pressable
      style={{
        backgroundColor: Colors.header,
        height: normalize(120),
        width: normalize(300),
        borderRadius: 8,
        overflow: 'hidden',
      }}
      onPress={() => onPress(id)}>
      <View
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
            ＄99,99,99999999.99
          </RNCText>
        </View>
      </View>
    </Pressable>
  );
};

export default CompanyCard;

const styles = StyleSheet.create({});
