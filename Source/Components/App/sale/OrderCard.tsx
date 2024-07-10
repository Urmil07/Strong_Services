import {Colors, FontFamily, FontSize} from '@Constants';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {RNCDropdown, RNCText} from 'Common';
import React, {FC} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {OrderProp} from '@Interfaces';
import normalize from 'react-native-normalize';
import {useOrderStore} from '@Actions';

interface Props {
  item: OrderProp;
  index: number;
  length: number;
  setValue: ({
    fieldName,
    index,
    value,
  }: {
    fieldName: string;
    value: any;
    index: number;
  }) => void;
  handleRemoveCard: ({index}: {index: number}) => void;
  flg: 0 | 1 | 2;
}
const OrderCard: FC<Props> = ({
  item,
  index,
  setValue,
  length,
  handleRemoveCard,
  flg,
}) => {
  const {ItemList} = useOrderStore();

  return (
    <View style={styles.card}>
      {length > 1 && (
        <Pressable
          style={{
            backgroundColor: Colors.E85555,
            position: 'absolute',
            zIndex: 1000,
            top: -normalize(8),
            right: 0,
            borderRadius: 50,
            padding: normalize(5),
          }}
          onPress={() => handleRemoveCard({index})}>
          <Ionicons
            name="remove-circle-outline"
            size={normalize(18)}
            color={Colors.Black}
          />
        </Pressable>
      )}

      <RNCDropdown
        Data={ItemList}
        value={item.itemid}
        dropdownstyle={{
          backgroundColor: Colors.background,
          padding: 0,
          paddingHorizontal: normalize(5),
        }}
        selectedtextstyle={{fontSize: FontSize.font10}}
        placeholderstyle={{fontSize: FontSize.font10}}
        placeholderText={'Select Item'}
        onChange={value => {
          // console.log('value', value);

          setValue({index, fieldName: 'item', value});
          // setOrderValue({index, fieldName: 'item', value});
        }}
        search
        disable={flg !== 0}
      />

      <View style={{flexDirection: 'row', gap: 7}}>
        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>PCS</RNCText>
          <TextInput
            style={[
              styles.cardInput,
              {
                backgroundColor:
                  flg == 1 ? Colors.inpDisable : Colors.background,
              },
            ]}
            keyboardType="numeric"
            defaultValue={item.pcs}
            onChangeText={value => {
              setValue({index, fieldName: 'pcs', value});
            }}
            onEndEditing={e => {
              const {text} = e.nativeEvent;
              setValue({index, fieldName: 'pcs', value: text});
            }}
            editable={flg !== 1}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>PAC</RNCText>
          <TextInput
            style={[
              styles.cardInput,
              {
                backgroundColor:
                  flg == 1 ? Colors.inpDisable : Colors.background,
              },
            ]}
            keyboardType="numeric"
            // value={item.pac}
            defaultValue={item.pac}
            onEndEditing={e => {
              const {text} = e.nativeEvent;
              setValue({index, fieldName: 'pac', value: text});
            }}
            editable={flg !== 1}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>QTY</RNCText>

          <TextInput
            style={[
              styles.cardInput,
              {
                backgroundColor:
                  flg == 1 ? Colors.inpDisable : Colors.background,
              },
            ]}
            keyboardType="numeric"
            value={item.qty}
            onEndEditing={e => {
              const {text} = e.nativeEvent;
              setValue({index, fieldName: 'qty', value: text});
            }}
            editable={false}
          />
        </View>
      </View>

      <View style={{flexDirection: 'row', gap: 7}}>
        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>MSTRATE</RNCText>
          <TextInput
            style={[styles.cardInput, {backgroundColor: Colors.inpDisable}]}
            value={item.rate}
            editable={false}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>RATE</RNCText>
          <TextInput
            style={[
              styles.cardInput,
              {
                backgroundColor:
                  flg == 1 ? Colors.inpDisable : Colors.background,
              },
            ]}
            value={item.rate}
            editable={flg !== 1}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>DISC 1 %</RNCText>
          <TextInput
            style={[styles.cardInput, {backgroundColor: Colors.inpDisable}]}
            keyboardType="numeric"
            value={item.disc1per}
            editable={false}
          />
        </View>
      </View>

      <View style={{flexDirection: 'row', gap: 7}}>
        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>DISC 2 %</RNCText>
          <TextInput
            style={[
              styles.cardInput,
              {
                backgroundColor:
                  flg == 1 ? Colors.inpDisable : Colors.background,
              },
            ]}
            keyboardType="numeric"
            defaultValue={item.disc2per}
            onEndEditing={e => {
              const {text} = e.nativeEvent;
              setValue({index, fieldName: 'disc2per', value: text});
            }}
            editable={flg !== 1}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>SGST %</RNCText>
          <TextInput
            style={[styles.cardInput, {backgroundColor: Colors.inpDisable}]}
            value={item.sgstper}
            editable={false}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>CGST %</RNCText>
          <TextInput
            style={[styles.cardInput, {backgroundColor: Colors.inpDisable}]}
            keyboardType="numeric"
            value={item.cgstper}
            editable={false}
          />
        </View>

        <View style={styles.cardContainer}>
          <RNCText style={styles.cardTitle}>IGST %</RNCText>
          <TextInput
            style={[styles.cardInput, {backgroundColor: Colors.inpDisable}]}
            keyboardType="numeric"
            value={item.igstper}
            editable={false}
          />
        </View>
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: normalize(10),
    gap: 5,
  },
  cardContainer: {
    flex: 1,
    gap: 2,
  },
  cardInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: normalize(5),
    color: Colors.Black,
    height: normalize(26),
    shadowOpacity: 0,
    fontSize: FontSize.font10,
  },
  cardTitle: {
    fontSize: FontSize.font11,
    fontFamily: FontFamily.SemiBold,
    left: normalize(5),
  },
  cardValue: {
    color: Colors.Black,
  },
});
