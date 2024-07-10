import {Colors, FetchMethod, FontFamily, URL} from '@Constants';
import {Functions, logger} from '@Utils';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  getUserInfo,
  isLoading,
  setLoading,
  setToast,
  usePrivilegesStore,
} from '@Actions';

import {Datausermst} from '@/Interfaces/ReportInterface';
import {Divider} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import NetInfo from '@react-native-community/netinfo';
import {RNCText} from 'Common';
import Switch from '@splicer97/react-native-switch';
import {UserPrivilegesPageProps} from '@/Interfaces/AppStackParamList';
import {getDBConnection} from '@/DB/database';
import normalize from 'react-native-normalize';

const UserPrivileges: FC<UserPrivilegesPageProps> = ({navigation, route}) => {
  const {User} = route.params;
  // const {User} = usePrivilegesStore(state => ({
  //   User: state.User as Datausermst,
  // }));

  const [arepsaleos, setarepsaleos] = useState<boolean>(true);
  const [areppurcos, setareppurcos] = useState<boolean>(true);
  const [arepledger, setarepledger] = useState<boolean>(true);
  const [arepcoldstkwise, setarepcoldstkwise] = useState<boolean>(false);

  const handlePasswordNavigation = async () => {
    const User = await Functions.getUser();

    navigation.navigate('ChangePassword', {
      accrights: User.userrights,
      entryemail: User.entryemail,
      oldpwd: User.userpwd,
      accId: User.accid.toString(),
      Type: 'User',
      update: true,
    });
  };

  useEffect(() => {
    setLoading(true);
    getUserInfo({accId: User.accId});
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => setUserData(), [User]);

  const setUserData = useCallback(() => {
    if (User) {
      const arepcoldstkwise = User.arepcoldstkwise
        ? User.arepcoldstkwise !== '0'
          ? true
          : false
        : false;

      const arepsaleos = User.arepsaleos
        ? User.arepsaleos !== '0'
          ? true
          : false
        : false;

      const areppurcos = User.areppurcos
        ? User.areppurcos !== '0'
          ? true
          : false
        : false;

      const arepledger = User.arepledger
        ? User.arepledger !== '0'
          ? true
          : false
        : false;

      setarepsaleos(arepsaleos);
      setareppurcos(areppurcos);
      setarepledger(arepledger);
      setarepcoldstkwise(arepcoldstkwise);
    }
  }, [User]);

  const handleSubmit = async () => {
    if (isLoading()) return;
    setLoading(true);

    const Device = await NetInfo.fetch();
    if (Device && Device.isConnected) {
      try {
        const db = await getDBConnection();
        const updarepsaleos = arepsaleos ? 1 : 0;
        const updareppurcos = areppurcos ? 1 : 0;
        const updarepledger = arepledger ? 1 : 0;
        const updarepcoldstkwise = arepcoldstkwise ? 1 : 0;

        const Params = {
          entryemail: User.entryEmail,
          accid: User.accId,
          accpwd: User.accpwd,
          arepsaleos: updarepsaleos,
          areppurcos: updareppurcos,
          arepledger: updarepledger,
          arepcoldstkwise: updarepcoldstkwise,
        };

        const response = await FetchMethod.POST_FORMDATA({
          EndPoint: URL.EstrongAccrights,
          Params,
        });
        console.log('response', response);

        if (response.status !== 200) throw response.message;

        let query = `UPDATE users SET arepsaleos='${updarepsaleos}', areppurcos='${updareppurcos}', arepledger='${updarepledger}', arepcoldstkwise='${updarepcoldstkwise}' WHERE accId=${User.accId}`;
        console.log('query', query);
        db.transaction(tx => {
          tx.executeSql(
            query,
            [],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                let currUser = User;
                currUser.arepsaleos = String(updarepsaleos);
                currUser.areppurcos = String(updareppurcos);
                currUser.arepledger = String(updarepledger);
                currUser.arepcoldstkwise = String(updarepcoldstkwise);
                navigation.setParams({User: currUser});
                setUserData();
              }
            },
            error => {
              setToast({
                toast: true,
                toastMessage: 'Something went wrong updating User ',
              });
            },
          );
        });
      } catch (error) {
        let message = 'Something went wrong updating User!';
        if (typeof error === 'string' && error) message = error;
        if (error instanceof Error) message = error.message;
        logger.toast(message);
      } finally {
        setLoading(false);
      }
    } else {
      setToast({toast: true, toastMessage: 'Please Check Internet Connection'});
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{gap: 5}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate('ChangePassword', {
              accrights: User.accrights,
              entryemail: User.entryEmail,
              oldpwd: User.accpwd,
              accId: User.accId.toString(),
              Type: 'User',
            })
          }>
          <RNCText style={styles.titleText}>Change Password</RNCText>
          <Entypo
            name="chevron-right"
            size={normalize(30)}
            color={Colors.Text}
          />
        </Pressable>

        <Divider style={styles.divider} />

        <View style={styles.itemContainer}>
          <RNCText style={styles.titleText}>Sale Out Standing</RNCText>
          <Switch
            value={arepsaleos!}
            onValueChange={setarepsaleos}
            activeColor={Colors.header}
            inactiveColor={Colors.header + 55}
            circleStyle={{backgroundColor: Colors.card}}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.itemContainer}>
          <RNCText style={styles.titleText}>Purchase Out Standing</RNCText>
          <Switch
            value={areppurcos}
            onValueChange={setareppurcos}
            activeColor={Colors.header}
            inactiveColor={Colors.header + 55}
            circleStyle={{backgroundColor: Colors.card}}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.itemContainer}>
          <RNCText style={styles.titleText}>Ledger</RNCText>
          <Switch
            value={arepledger}
            onValueChange={setarepledger}
            activeColor={Colors.header}
            inactiveColor={Colors.header + 55}
            circleStyle={{backgroundColor: Colors.card}}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.itemContainer}>
          <RNCText style={styles.titleText}>Cold Stockwise</RNCText>
          <Switch
            value={arepcoldstkwise}
            onValueChange={setarepcoldstkwise}
            activeColor={Colors.header}
            inactiveColor={Colors.header + 55}
            circleStyle={{backgroundColor: Colors.card}}
          />
        </View>
      </ScrollView>
      <Pressable style={styles.bottomBtn} onPress={handleSubmit}>
        <RNCText family={FontFamily.Bold} color={Colors.WText}>
          Submit
        </RNCText>
      </Pressable>
      <SafeAreaView />
    </View>
  );
};

export default UserPrivileges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
  },
  itemContainer: {
    padding: normalize(10),
    borderRadius: 4,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    width: '95%',
    alignSelf: 'center',
  },
  titleText: {
    fontFamily: FontFamily.SemiBold,
  },
  bottomBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.header,
    backgroundColor: Colors.header,
    padding: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
