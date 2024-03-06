import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
} from 'react-native-reanimated';
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import {Colors, FontFamily, FontSize} from '@Constants';
import {Datapurco, Datasaleo} from '@/Interfaces/ReportInterface';
import {ListRenderItem, StyleSheet, View} from 'react-native';
import React, {FC, PropsWithChildren, ReactNode, useState} from 'react';

import {RNCText} from 'Common';
import dayjs from 'dayjs';
import normalize from 'react-native-normalize';

const OSView: ListRenderItem<Datasaleo | Datapurco> = ({index, item}) => {
  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });
  // const [Expanded, setExpanded] = useState(false);
  return (
    <Collapse
      // onToggle={(isExpanded: boolean) => setExpanded(isExpanded)}
      touchableOpacityProps={{activeOpacity: 100}}>
      <CollapseHeader>
        <View style={[styles.headContainer]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              // gap: 5,
            }}>
            <RNCText size={FontSize.font11}>
              Date :{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {dayjs(item.invdate).format('DD/MM/YYYY')}[{item.invnochr}]
              </RNCText>
            </RNCText>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}}>
              <RNCText size={FontSize.font11}>
                Days :{' '}
                <RNCText size={FontSize.font11}>
                  {item.days}
                  {item.compcode && `[${item.compcode}]`}
                </RNCText>
              </RNCText>
            </View>
            <View
              style={{
                width: '30%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <RNCText size={FontSize.font12} family={FontFamily.SemiBold}>
                {format(Number(item.balamt))}
              </RNCText>
            </View>
            <View
              style={{
                width: '30%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <RNCText size={FontSize.font12} family={FontFamily.SemiBold}>
                {format(Number(item.runbalamt))}
              </RNCText>
            </View>
          </View>
        </View>
      </CollapseHeader>
      <CollapseBody>
        <Animated.View style={styles.bodyContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* <RNCText
              numberOfLines={1}
              style={{width: '50%'}}
              size={FontSize.font12}>
              Comp. Code:{' '}
              <RNCText
                numberOfLines={1}
                size={FontSize.font12}
                family={FontFamily.Bold}>
                {item.compcode}
              </RNCText>
            </RNCText> */}
            <RNCText
              numberOfLines={1}
              // style={{width: '50%'}}
              size={FontSize.font12}>
              Bill Amt. :{' '}
              <RNCText
                numberOfLines={1}
                size={FontSize.font12}
                family={FontFamily.Bold}>
                {format(Number(item.billamt))}
              </RNCText>
            </RNCText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RNCText numberOfLines={1} size={FontSize.font12}>
              Agent Name:{' '}
              <RNCText
                numberOfLines={1}
                size={FontSize.font12}
                family={FontFamily.Bold}>
                {item.agentname}
              </RNCText>
            </RNCText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RNCText
              numberOfLines={1}
              style={{width: '50%'}}
              size={FontSize.font12}>
              PrevRec Amt :{' '}
              <RNCText
                numberOfLines={1}
                size={FontSize.font12}
                family={FontFamily.Bold}>
                {format(Number(item.prevrecamt))}
              </RNCText>
            </RNCText>
            <RNCText
              numberOfLines={1}
              style={{width: '50%'}}
              size={FontSize.font12}>
              Rec Amt :{' '}
              <RNCText
                numberOfLines={1}
                size={FontSize.font12}
                family={FontFamily.Bold}>
                {format(Number(item.recamt))}
              </RNCText>
            </RNCText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RNCText numberOfLines={1} size={FontSize.font12}>
              Book Name:{' '}
              <RNCText
                numberOfLines={1}
                size={FontSize.font12}
                family={FontFamily.Bold}>
                {item.bookname}
              </RNCText>
            </RNCText>
          </View>
        </Animated.View>
      </CollapseBody>
    </Collapse>
  );
};

export default OSView;

const styles = StyleSheet.create({
  headContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(8),
    borderRadius: 4,
    justifyContent: 'center',
  },
  bodyContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingBottom: normalize(6),
    paddingHorizontal: normalize(8),
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    top: -normalize(4),
    gap: 4,
  },
});
