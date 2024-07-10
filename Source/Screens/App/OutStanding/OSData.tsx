import {Colors, FontFamily, FontSize} from '@Constants';
import {Datapurco, Datasaleo} from '@/Interfaces/ReportInterface';
import {
  FlatList,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  GetOSData,
  setLoading,
  setPartyWiseOS,
  useAppStore,
  useReportStore,
} from '@Actions';
import {RNCNodata, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {OSDataPageProps} from '@/Interfaces/AppStackParamList';
import {OSView} from 'CApp';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Zocial from 'react-native-vector-icons/Zocial';
import normalize from 'react-native-normalize';

const OSData: FC<OSDataPageProps> = ({navigation, route}) => {
  const {accid, compid, partyName, type, city, area, mobile} = route.params;
  const {PartyWiseOS, PartyTotal} = useReportStore();
  const {UserRights} = useAppStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight(props) {
        return (
          <Pressable onPress={handleClick}>
            <MaterialCommunityIcons
              name="microsoft-excel"
              size={normalize(24)}
              color={Colors.WText}
            />
          </Pressable>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      setPartyWiseOS([]);
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    if (UserRights == 'Owner' || UserRights == 'Agent') {
      GetOSData({type, Orderby: 'date', id: accid});
    } else if (UserRights == 'Client') {
      GetOSData({type, Orderby: 'date', id: compid});
    }
    setTimeout(() => {
      setLoading(false);
    }, 800);

    // FetchData();
  }, []);

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const exportDataToExcel = () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(PartyWiseOS);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

    // Write generated excel to Storage
    RNFS.writeFile(
      // RNFS.ExternalStorageDirectoryPath + '/my_exported_file.xlsx',
      `${RNFS.DownloadDirectoryPath}/${partyName}SaleOS.xlsx`,
      wbout,
      'ascii',
    )
      .then((r: any) => {
        console.log('Success');
      })
      .catch((e: any) => {
        console.log('Error', e);
      });
  };

  const handleClick = async () => {
    try {
      let isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermitedExternalStorage) {
        // Ask for permission
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        if (
          grants['android.permission.ACCESS_MEDIA_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
          exportDataToExcel();
        } else {
          console.log('Permission denied');
          return;
        }
      } else {
        // Already have Permission (calling our exportDataToExcel function)
        exportDataToExcel();
      }
    } catch (error) {}
  };

  return (
    <View style={{flex: 1, padding: normalize(10), gap: 7}}>
      <View
        style={{
          backgroundColor: Colors.backgroundSecondary + 80,
          padding: normalize(5),
          borderRadius: 4,
          gap: 5,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Ionicons name="business" size={normalize(18)} color={Colors.Black} />
          <RNCText family={FontFamily.Bold} size={FontSize.font13}>
            {partyName}
          </RNCText>
        </View>
        {UserRights !== 'Client' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                flex: 1,
              }}>
              <Zocial name="call" size={normalize(16)} color={Colors.Black} />
              <RNCText size={FontSize.font11}>{mobile}</RNCText>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                flex: 1,
              }}>
              <MaterialCommunityIcons
                name="home-city"
                size={normalize(16)}
                color={Colors.Black}
              />
              <RNCText size={FontSize.font11}>{city}</RNCText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                flex: 1,
              }}>
              <MaterialCommunityIcons
                name="home-city"
                size={normalize(16)}
                color={Colors.Black}
              />
              <RNCText size={FontSize.font11}>{area}</RNCText>
            </View>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.backgroundSecondary + 80,
          borderRadius: 4,
          padding: normalize(5),
        }}>
        <View
          style={{
            width: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <RNCText></RNCText>
        </View>
        <View
          style={{
            width: '30%',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <RNCText size={FontSize.font12} family={FontFamily.Bold}>
            Bal. Amount
          </RNCText>
        </View>
        <View
          style={{
            width: '30%',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <RNCText size={FontSize.font12} family={FontFamily.Bold}>
            Run Bal.
          </RNCText>
        </View>
      </View>

      {type === 'sale' ? (
        <FlatList
          data={PartyWiseOS as Datasaleo[]}
          showsVerticalScrollIndicator={false}
          renderItem={({index, item}) => (
            <OSView
              index={index}
              item={item}
              separators={{
                highlight: () => {},
                unhighlight: () => {},
                updateProps: (
                  select: 'leading' | 'trailing',
                  newProps: any,
                ) => {},
              }}
            />
          )}
          contentContainerStyle={{gap: 5}}
          style={{flex: 1}}
          ListEmptyComponent={RNCNodata}
        />
      ) : (
        <FlatList
          data={PartyWiseOS as Datapurco[]}
          showsVerticalScrollIndicator={false}
          renderItem={({index, item}) => (
            <OSView
              index={index}
              item={item}
              separators={{
                highlight: () => {},
                unhighlight: () => {},
                updateProps: (
                  select: 'leading' | 'trailing',
                  newProps: any,
                ) => {},
              }}
            />
          )}
          contentContainerStyle={{gap: 5}}
          style={{flex: 1}}
          ListEmptyComponent={RNCNodata}
        />
      )}

      <View
        style={{
          backgroundColor: Colors.backgroundSecondary + 80,
          borderRadius: 4,
          padding: normalize(5),
          gap: 5,
        }}>
        <View style={styles.totalRows}>
          <RNCText style={styles.totalTitle}>
            Bill Amt :{' '}
            <RNCText style={styles.totalAmt}>
              {format(PartyTotal.TotalBillAmt)}
            </RNCText>
          </RNCText>
          <RNCText style={styles.totalTitle}>
            Return Amt :{' '}
            <RNCText style={styles.totalAmt}>
              {format(PartyTotal.TotalReturnAmt)}
            </RNCText>
          </RNCText>
        </View>
        <View style={styles.totalRows}>
          <RNCText style={styles.totalTitle}>
            Prevrec Amt :{' '}
            <RNCText size={FontSize.font12} family={FontFamily.Bold}>
              {format(PartyTotal.TotalPrevrecAmt)}
            </RNCText>
          </RNCText>
          <RNCText style={[styles.totalTitle]}>
            Rec Amt :{' '}
            <RNCText style={styles.totalAmt}>
              {format(PartyTotal.TotalRecAmt)}
            </RNCText>
          </RNCText>
        </View>
        <View style={styles.totalRows}>
          <RNCText style={styles.totalTitle}>
            Bal Amt :{' '}
            <RNCText size={FontSize.font12} family={FontFamily.Bold}>
              {format(PartyTotal.TotalBalAmt)}
            </RNCText>
          </RNCText>
        </View>
      </View>
    </View>
  );
};

export default OSData;

const styles = StyleSheet.create({
  totalRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalTitle: {
    width: '48%',
    fontSize: FontSize.font12,
  },
  totalAmt: {fontSize: FontSize.font12, fontFamily: FontFamily.Bold},
});
