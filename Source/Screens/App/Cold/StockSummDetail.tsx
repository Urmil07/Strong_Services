import {Colors, FontFamily, FontSize} from '@Constants';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {GetPartyWiseStockSummary, useAppStore, useReportStore} from '@Actions';
import {RNCNodata, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect} from 'react';

import {StockSummDetailPageProps} from '@/Interfaces/AppStackParamList';
import {StockSummView} from 'CApp';
import normalize from 'react-native-normalize';

const StockSummDetail: FC<StockSummDetailPageProps> = ({navigation, route}) => {
  const {
    detail: {accname, accid, compname, compid},
  } = route.params;
  const {UserRights} = useAppStore();
  const {PartyWiseStockSummary} = useReportStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Stock Summary Details',
      headerBackTitle: 'Back',
      headerStyle: {backgroundColor: Colors.header},
      headerTintColor: Colors.WText,
    });
  }, []);

  useEffect(() => {
    if (UserRights == 'Owner' || UserRights == 'Agent') {
      GetPartyWiseStockSummary({id: accid});
    } else if (UserRights == 'Client') {
      GetPartyWiseStockSummary({id: compid});
    }
  }, [accid, compid]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: Colors.backgroundSecondary,
          padding: normalize(8),
          borderRadius: 4,
        }}>
        <RNCText family={FontFamily.Bold} size={FontSize.font13}>
          {UserRights == 'Owner' || UserRights == 'Agent'
            ? accname
            : UserRights == 'Client' && compname}
        </RNCText>
        {/* {UserRights == 'Owner' || UserRights == 'Agent' ? (
          <RNCText family={FontFamily.Bold} size={FontSize.font13}>
            {accname}
          </RNCText>
        ) : (
          <RNCText family={FontFamily.Bold} size={FontSize.font13}>
            {compname}
          </RNCText>
        )} */}
      </View>
      <FlatList
        data={PartyWiseStockSummary}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <StockSummView
              index={index}
              item={item}
              separators={{
                highlight: () => {},
                unhighlight: () => {},
                updateProps: () => {},
              }}
            />
          );
        }}
        contentContainerStyle={{gap: 5}}
        style={{marginBottom: normalize(5), flex: 1}}
        ListEmptyComponent={RNCNodata}
      />
    </View>
  );
};

export default StockSummDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(6),
    gap: 8,
  },
});
