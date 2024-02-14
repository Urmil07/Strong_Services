import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Colors, Images, normalize} from '@Constants';
import {RNCButton, RNCDropdown, RNCText, RNCTextInput} from 'Common';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import FastImage from 'react-native-fast-image';
import {useAppDispatch, useAppSelector} from '@ReduxHook';
import {Estronglogin, SetIsAuth} from 'Reducers';
import {useForm} from 'react-hook-form';
import {FormValues} from '@/Interfaces/Common';

const LoginType = [
  {label: 'OWNER', value: 'OWNER'},
  {label: 'CLIENT', value: 'CLIENT'},
];

const Login = () => {
  const dispatch = useAppDispatch();
  const {ToggleToast} = useAppSelector(({AppReducer}) => AppReducer);

  const [PasswordHide, setPasswordHide] = useState(true);
  const [ActiveTab, setActiveTab] = useState('OWNER');
  const {control, handleSubmit, resetField, reset} = useForm<FormValues>({
    defaultValues: {
      // EntryId: 'patelwarehousing27@gmail.com',
      // EntryPwd: '3242',
      // EntryId: 'abhinandanagrocoldstorage@gmail.com',
      // EntryPwd: 'aa01',
      // AccountID: '1121',
    },
  });

  const OnSubmit = (data: any) => {
    // console.log('data', data);
    // Estronglogin({EntryId: 'patelwarehousing27@gmail.com', EntryPwd: '3242'}),
    dispatch(Estronglogin(data))
      .unwrap()
      .then(async response => {
        if (response.status === 200) {
          dispatch(SetIsAuth(false));
        }
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: normalize(10)}}>
        <View
          style={{
            height: normalize(200),
            justifyContent: 'center',
          }}>
          <FastImage
            source={Images.StrongServices}
            style={{height: normalize(100)}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: normalize(10),
            gap: 10,
          }}>
          {/* <Pressable
            style={{
              backgroundColor:
                ActiveTab == 'OWNER'
                  ? Colors.backgroundSecondary
                  : Colors.disable,
              height: normalize(40),
              padding: normalize(10),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              width: normalize(100),
            }}
            onPress={() => {
              reset();
              setActiveTab('OWNER');
            }}>
            <RNCText color={Colors.White}>OWNER</RNCText>
          </Pressable>
          <Pressable
            style={{
              backgroundColor:
                ActiveTab == 'CLIENT'
                  ? Colors.backgroundSecondary
                  : Colors.disable,
              height: normalize(40),
              padding: normalize(10),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              width: normalize(100),
            }}
            onPress={() => {
              reset();
              setActiveTab('CLIENT');
            }}>
            <RNCText color={Colors.White}>CLIENT</RNCText>
          </Pressable> */}

          <RNCDropdown
            Data={LoginType}
            value={ActiveTab}
            placeholderText={'Select Login type...'}
            onChange={text => setActiveTab(text.value)}
            style={{flex: 1, padding: 0}}
          />
        </View>
        {ActiveTab === 'OWNER' ? (
          <View style={{gap: 12}}>
            <RNCTextInput
              control={control}
              name="EntryId"
              title="EntryID"
              placeholder="Enter Entry ID"
              placeholderTextColor={Colors.Black}
              leftContainer={
                <View style={styles.LeftContainer}>
                  <FontAwesome
                    name="user"
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </View>
              }
              autoCorrect={false}
            />
            <RNCTextInput
              control={control}
              onChangeText={() => null}
              title="Password"
              name="EntryPwd"
              placeholder="Enter Password"
              placeholderTextColor={Colors.Black}
              secureTextEntry={PasswordHide}
              leftContainer={
                <View style={styles.LeftContainer}>
                  <FontAwesome
                    name="key"
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </View>
              }
              rightContainer={
                <Pressable
                  style={styles.RightContainer}
                  onPress={() => setPasswordHide(!PasswordHide)}>
                  <FontAwesome
                    name={PasswordHide ? 'eye' : 'eye-slash'}
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </Pressable>
              }
            />

            {/* <Pressable
              style={styles.CheckBoxContainer}
              onPress={() => setisChecked(!isChecked)}>
              <View>
                <MaterialCommunityIcons
                  name={
                    isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={24}
                  color={Colors.backgroundSecondary}
                />
              </View>
              <RNCText family={FontFamily.SemiBold} size={FontSize.font16}>
                Remember Password
              </RNCText>
            </Pressable> */}
          </View>
        ) : (
          <View style={{gap: 12}}>
            <RNCTextInput
              onChangeText={() => null}
              control={control}
              title="EntryId"
              name="EntryId"
              placeholder="Enter Entry ID"
              placeholderTextColor={Colors.Black}
              leftContainer={
                <View style={styles.LeftContainer}>
                  <FontAwesome
                    name="user"
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </View>
              }
            />
            <RNCTextInput
              onChangeText={() => null}
              control={control}
              title="AccountID"
              name="AccountID"
              placeholder="Enter Account ID"
              placeholderTextColor={Colors.Black}
              leftContainer={
                <View style={styles.LeftContainer}>
                  <FontAwesome
                    name="user"
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </View>
              }
              secureTextEntry={false}
            />
            <RNCTextInput
              onChangeText={() => null}
              name="EntryPwd"
              title="Password"
              control={control}
              secureTextEntry={PasswordHide}
              placeholder="Enter Password"
              placeholderTextColor={Colors.Black}
              leftContainer={
                <View style={styles.LeftContainer}>
                  <FontAwesome
                    name="key"
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </View>
              }
              rightContainer={
                <Pressable
                  style={styles.RightContainer}
                  onPress={() => setPasswordHide(!PasswordHide)}>
                  <FontAwesome
                    name={PasswordHide ? 'eye' : 'eye-slash'}
                    size={normalize(15)}
                    color={Colors.Black}
                  />
                </Pressable>
              }
            />

            {/* <Pressable
              style={styles.CheckBoxContainer}
              onPress={() => setisChecked(!isChecked)}>
              <View>
                <MaterialCommunityIcons
                  name={
                    isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={24}
                  color={Colors.backgroundSecondary}
                />
              </View>
              <RNCText family={FontFamily.SemiBold} size={FontSize.font16}>
                Remember Password
              </RNCText>
            </Pressable> */}
          </View>
        )}

        <RNCButton
          name={'Login'}
          style={{marginTop: normalize(15)}}
          onPress={handleSubmit(OnSubmit)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  LeftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(50),
    borderRightWidth: 1,
    borderRightColor: Colors.Black,
  },
  RightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(50),
    borderLeftWidth: 1,
    borderLeftColor: Colors.Black,
  },
  CheckBoxContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
    gap: 6,
  },
});
