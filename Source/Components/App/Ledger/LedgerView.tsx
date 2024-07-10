import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import {Colors, FontFamily, FontSize} from '@Constants';
import {ListRenderItem, StyleSheet, Text, View} from 'react-native';

import {LedgerDataInterfase} from '@/Interfaces/DBReducerInterFace';
import {RNCText} from 'Common';
import React from 'react';
import dayjs from 'dayjs';
import normalize from 'react-native-normalize';

const LedgerView: ListRenderItem<LedgerDataInterfase> = ({index, item}) => {
  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });
  return (
    <Collapse touchableOpacityProps={{activeOpacity: 100}}>
      <CollapseHeader>
        <View style={styles.headContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '35%'}}>
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {dayjs(item.ldate).format('DD/MM/YYYY')}
              </RNCText>
            </View>
            <View
              style={{
                width: '32.5%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <RNCText
                size={FontSize.font11}
                family={FontFamily.Bold}
                color={Colors.Danger}>
                {format(Number(item.dramt))}
              </RNCText>
            </View>
            <View
              style={{
                width: '32.5%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <RNCText
                size={FontSize.font11}
                family={FontFamily.Bold}
                color={Colors.EAGreen}>
                {format(Number(item.cramt))}
              </RNCText>
            </View>
          </View>
          <View>
            <RNCText size={FontSize.font11}>
              Account :{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {item.account}
              </RNCText>
            </RNCText>
          </View>
        </View>
      </CollapseHeader>
      <CollapseBody>
        <View style={[styles.bodyContainer, {paddingTop: normalize(6)}]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RNCText size={FontSize.font11}>
              Month :{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {item.monthname}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              Bal :{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {format(Number(item.balamt))}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              CrDr :{' '}
              <RNCText
                size={FontSize.font11}
                family={FontFamily.Bold}
                color={item.crdr == 'Dr' ? Colors.Danger : Colors.EAGreen}>
                {item.crdr}
              </RNCText>
            </RNCText>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'flex-start', gap: 5}}>
            {/* <View style={{flex: 0.8}}>
              <RNCText size={FontSize.font11}>
                Account :{' '}
                <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                  {item.account}
                </RNCText>
              </RNCText>
            </View> */}

            <View style={{flex: 1}}>
              <RNCText size={FontSize.font11}>
                Agent :{' '}
                <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                  {item.agentName}
                </RNCText>
              </RNCText>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 5,
            }}>
            <View style={{flex: 1}}>
              <RNCText size={FontSize.font11}>
                Cheque :{' '}
                <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                  {item.cheque}
                </RNCText>
              </RNCText>
            </View>
            <View style={{flex: 1}}>
              <RNCText size={FontSize.font11}>
                Subsch :{' '}
                <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                  {item.subschedule}
                </RNCText>
              </RNCText>
            </View>
          </View>

          <View>
            <RNCText size={FontSize.font11}>
              Narration :{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {item.narration}
              </RNCText>
            </RNCText>
          </View>

          <View>
            <RNCText size={FontSize.font11}>
              Remarks :{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {item.remarks}
              </RNCText>
            </RNCText>
          </View>
        </View>
      </CollapseBody>
    </Collapse>
  );
};

export default LedgerView;

const styles = StyleSheet.create({
  headContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(8),
    borderRadius: 4,
    justifyContent: 'center',
    gap: 6,
  },
  bodyContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingBottom: normalize(6),
    paddingHorizontal: normalize(8),
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    top: -normalize(4),
    gap: 6,
  },
});
