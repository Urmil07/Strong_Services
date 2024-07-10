import {Colors, FontFamily, FontSize} from '@Constants';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {setIsAuth, useAppStore} from '@Actions';

import {DeleteAllData} from '@/DB/database';
import {Divider} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Functions} from '@Utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigation} from '@/Interfaces/AppStackParamList';
import {useNavigation} from '@react-navigation/native';

interface UserProp {
  accrights: string;
  entryemail: string;
  oldpwd: string;
  accId?: string;
  Type: 'Owner' | 'User';
}

const RNCDrawerView = (props: any) => {
  const navigation = useNavigation<StackNavigation>();

  const {UserRights} = useAppStore();

  const [User, setUser] = useState<UserProp>();

  const handleLogout = async () => {
    await Functions.setUser(null);
    await DeleteAllData();

    setIsAuth(false);
  };

  const handlePasswordNavigation = async () => {
    const User = await Functions.getUser();

    if (UserRights == 'Owner') {
      navigation.navigate('ChangePassword', {
        accrights: User.userrights,
        entryemail: User.entryemail,
        oldpwd: User.userpwd,
        Type: 'Owner',
        update: true,
      });
    } else if (UserRights == 'Agent' || UserRights == 'Client') {
      navigation.navigate('ChangePassword', {
        accrights: User.userrights,
        entryemail: User.entryemail,
        oldpwd: User.userpwd,
        accId: User.accid.toString(),
        Type: 'User',
        update: true,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.header,
      }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, gap: 5}}>
          <DrawerItem
            label={'Home'}
            icon={() => (
              <FontAwesome5 name="home" size={20} color={Colors.WText} />
            )}
            onPress={async () => navigation.navigate('Home')}
            labelStyle={styles.label}
          />

          <Divider style={styles.dividerContainer} />

          <DrawerItem
            label={'Change Password'}
            icon={() => (
              <FontAwesome5 name="key" size={18} color={Colors.WText} />
            )}
            onPress={handlePasswordNavigation}
            labelStyle={styles.label}
          />

          <Divider style={styles.dividerContainer} />

          {UserRights == 'Owner' && (
            <DrawerItem
              label={'User Privileges'}
              icon={() => (
                <FontAwesome5 name="user-alt" size={18} color={Colors.WText} />
              )}
              onPress={async () => navigation.navigate('UserList')}
              labelStyle={styles.label}
            />
          )}
        </View>
      </DrawerContentScrollView>

      <DrawerItem
        label={'Logout'}
        icon={() => (
          <FontAwesome5 name="power-off" size={18} color={Colors.WText} />
        )}
        onPress={handleLogout}
        labelStyle={styles.label}
        style={{backgroundColor: Colors.card}}
      />
    </SafeAreaView>
  );
};

export default RNCDrawerView;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.E85555,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontFamily.SemiBold,
    fontSize: FontSize.font11,
    color: Colors.WText,
  },
  itemcontainer: {
    backgroundColor: '#007fff',
  },
  label: {
    color: Colors.WText,
    fontFamily: FontFamily.Black,
  },
  dividerContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.White,
    width: '85%',
  },
});
