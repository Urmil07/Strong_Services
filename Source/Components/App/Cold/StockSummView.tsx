import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import {Colors, FontFamily, FontSize} from '@Constants';
import {ListRenderItem, StyleSheet, Text, View} from 'react-native';

import {Datacoldstksummst} from '@/Interfaces/ReportInterface';
import {RNCText} from 'Common';
import React from 'react';
import dayjs from 'dayjs';
import normalize from 'react-native-normalize';

const StockSummView: ListRenderItem<Datacoldstksummst> = ({item, index}) => {
  return (
    <Collapse touchableOpacityProps={{activeOpacity: 100}}>
      <CollapseHeader>
        <View style={styles.headContainer}>
          <View style={{flexDirection: 'row', gap: 5}}>
            <RNCText size={FontSize.font11} family={FontFamily.Medium}>
              Lot No:{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {/* {dayjs(item.ldate).format('DD/MM/YYYY')} */}
                {item.lotno}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11} family={FontFamily.Medium}>
              [BalQty:{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {/* {dayjs(item.ldate).format('DD/MM/YYYY')} */}
                {item.balqty}
              </RNCText>
              ]
            </RNCText>
            <RNCText size={FontSize.font11} family={FontFamily.Medium}>
              [BalWt:{' '}
              <RNCText size={FontSize.font11} family={FontFamily.Bold}>
                {/* {dayjs(item.ldate).format('DD/MM/YYYY')} */}
                {item.balweight}
              </RNCText>
              ]
            </RNCText>
          </View>
        </View>
      </CollapseHeader>
      <CollapseBody>
        <View style={[styles.bodyContainer, {paddingTop: normalize(6)}]}>
          <View>
            <RNCText size={FontSize.font11}>
              Item:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.itemname}
              </RNCText>
            </RNCText>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <RNCText size={FontSize.font11}>
                Vakkal:{' '}
                <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                  {item.vakkal}
                </RNCText>
              </RNCText>
              <RNCText size={FontSize.font11}>
                Lot:{' '}
                <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                  {item.partylot}
                </RNCText>
              </RNCText>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RNCText size={FontSize.font11}>
              In QTY:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.qty}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              In Wt:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.weight}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              Out QTY:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.outqty}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              Out Wt:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.outweight}
              </RNCText>
            </RNCText>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RNCText size={FontSize.font11}>
              Sr No:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.srnochr}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              Sr Date:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {dayjs(item.serialdt).format('YYYY-MM-DD')}
              </RNCText>
            </RNCText>
            <RNCText size={FontSize.font11}>
              Chl No:{' '}
              <RNCText family={FontFamily.Bold} size={FontSize.font11}>
                {item.chlnochr}
              </RNCText>
            </RNCText>
          </View>
          <View></View>
        </View>
      </CollapseBody>
    </Collapse>
  );
};

export default StockSummView;

const styles = StyleSheet.create({
  headContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: normalize(8),
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
