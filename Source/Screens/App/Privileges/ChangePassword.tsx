import {ChangeUserPassword, setLoading, setToast} from '@Actions';
import {FontFamily, FontSize} from '@Constants';
import {RNCButton, RNCText, RNCTextInput} from 'Common';
import React, {FC} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {ChangePasswordPageProps} from '@/Interfaces/AppStackParamList';
import {FormValues} from '@/Interfaces/Common';
import {logger} from '@Utils';
import normalize from 'react-native-normalize';
import {useForm} from 'react-hook-form';

const ChangePassword: FC<ChangePasswordPageProps> = ({navigation, route}) => {
  const {oldpwd, update} = route.params;
  const {control, handleSubmit, reset} = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const {oldPassword, newPassword, confirmPassword} = values;
      if (!oldPassword) throw 'Enter old password';
      if (!newPassword) throw 'Enter New password';
      if (!confirmPassword) throw 'Enter Confirm password';
      if (oldpwd !== oldPassword)
        throw 'Password do not match with old password';
      if (newPassword !== confirmPassword)
        throw 'New password do not match with confirm password';

      const response = await ChangeUserPassword({
        ...route.params,
        newpwd: newPassword,
      });
      if (response) navigation.setParams({oldpwd: newPassword});

      reset();
    } catch (error) {
      let message = 'Something went wrong!';
      if (typeof error === 'string' && error) message = error;
      if (error instanceof Error) message = error.message;
      logger.toast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{gap: 12}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <RNCText style={styles.label}>Old Password</RNCText>
          <RNCTextInput control={control} name="oldPassword" secureTextEntry />
        </View>

        <View style={styles.innerContainer}>
          <RNCText style={styles.label}>New Password</RNCText>
          <RNCTextInput control={control} name="newPassword" secureTextEntry />
        </View>

        <View style={styles.innerContainer}>
          <RNCText style={styles.label}>Confirm Password</RNCText>
          <RNCTextInput
            control={control}
            name="confirmPassword"
            secureTextEntry
          />
        </View>

        <RNCButton name="Change" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
    // gap: 12,
  },
  innerContainer: {
    gap: 5,
  },
  label: {
    fontFamily: FontFamily.Bold,
    left: normalize(5),
    fontSize: FontSize.font15,
  },
});
