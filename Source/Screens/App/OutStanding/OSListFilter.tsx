import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, FontFamily, FontSize, isAndroid} from '@Constants';
import normalize from 'react-native-normalize';
import {Pressable} from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {RNCButton, RNCText} from 'Common';
import {OSListFilterPageProps} from '@/Interfaces/AppStackParamList';
import {MultiSelect} from 'react-native-element-dropdown';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {
  GetFilterData,
  SetApplyFilter,
  SetFilterAgent,
  SetFilterArea,
  SetFilterCity,
  SetResetFilter,
} from 'Reducers';

const OSListFilter = ({navigation, route}: OSListFilterPageProps) => {
  const {type} = route.params;
  const dispatch = useAppDispatch();
  const {MastAgent, MastCity, MastArea, FilterCity, FilterAgent, FilterArea} =
    useAppSelector(({DBReducer}) => DBReducer);

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    dispatch(GetFilterData({type}));
  }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.header} />
      <SafeAreaView style={{backgroundColor: Colors.header}} />

      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.header,
          paddingVertical: isAndroid ? normalize(17) : normalize(8),
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            left: normalize(15),
          }}>
          <Pressable
            style={{
              padding: normalize(10),
              borderRadius: 100,
            }}
            onPress={() => navigation.goBack()}>
            <FontAwesome6Icon
              name="chevron-left"
              size={normalize(20)}
              color={Colors.White}
            />
          </Pressable>
          <RNCText
            family={FontFamily.SemiBold}
            size={FontSize.font18}
            color={Colors.WText}>
            Filter
          </RNCText>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          padding: normalize(10),
          gap: 15,
        }}>
        <View style={{gap: 5}}>
          <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
            City
          </RNCText>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            search
            data={MastCity}
            labelField="label"
            valueField="value"
            placeholder="Select City..."
            searchPlaceholder="Search..."
            value={FilterCity}
            onChange={item => {
              dispatch(SetFilterCity(item));
            }}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>

        <View style={{gap: 5}}>
          <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
            Agent
          </RNCText>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            search
            data={MastAgent}
            labelField="label"
            valueField="value"
            placeholder="Select City..."
            searchPlaceholder="Search..."
            value={FilterAgent}
            onChange={item => {
              dispatch(SetFilterAgent(item));
            }}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>

        <View style={{gap: 5}}>
          <RNCText family={FontFamily.Bold} style={{left: normalize(10)}}>
            Area
          </RNCText>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.containerStyle}
            search
            data={MastArea}
            labelField="label"
            valueField="value"
            placeholder="Select City..."
            searchPlaceholder="Search..."
            value={FilterArea}
            onChange={item => {
              dispatch(SetFilterArea(item));
            }}
            selectedStyle={styles.selectedStyle}
            activeColor={Colors.LightBlue}
            itemTextStyle={styles.itemTextStyle}
            fontFamily={FontFamily.Regular}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
          alignSelf: 'flex-end',
          bottom: 0,
          padding: normalize(10),
        }}>
        <RNCButton
          name={'Reset'}
          style={{
            flex: 1,
            borderColor: Colors.btn,
            borderWidth: 1,
            backgroundColor: Colors.transparent,
          }}
          btnTextStyle={{color: Colors.Black}}
          onPress={() => {
            dispatch(SetResetFilter(true));
            navigation.goBack();
          }}
        />
        <RNCButton
          name={'Apply'}
          style={{flex: 1}}
          onPress={() => {
            dispatch(SetApplyFilter(true));
            navigation.goBack();
          }}
        />
      </View>
      <SafeAreaView />
    </View>
  );
};

export default OSListFilter;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: normalize(10),
  },
  containerStyle: {
    borderRadius: 8,
    backgroundColor: Colors.White,
  },
  placeholderStyle: {
    fontSize: FontSize.font13,
    color: Colors.Black,
  },
  selectedTextStyle: {
    fontSize: FontSize.font13,
    color: Colors.Black,
    fontFamily: FontFamily.SemiBold,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: FontSize.font13,
    color: Colors.Black,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: Colors.White,
    color: Colors.Black,
  },
  itemTextStyle: {
    color: Colors.Black,
  },
});
