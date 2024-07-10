import {Colors, FontFamily, FontSize} from '@Constants';
import {setToast, useAppStore} from '@Actions';

import RNCText from './RNCText';
import React from 'react';
import {Snackbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const RNCToast = () => {
  const {toast, toastDuration, toastMessage, toastColor, toastTextColor} =
    useAppStore(state => ({
      toast: state.toast,
      toastDuration: state.toastDuration,
      toastMessage: state.toastMessage,
      toastColor: state.toastColor,
      toastTextColor: state.toastTextColor,
    }));

  return (
    <Snackbar
      visible={toast}
      onDismiss={() => setToast({toast: false})}
      action={{
        label: 'Close',
        labelStyle: {
          fontSize: FontSize.font14,
          fontFamily: FontFamily.SemiBold,
          color: toastTextColor || Colors.WText,
        },
        onPress: () => {
          setToast({toast: false});
        },
      }}
      duration={toastDuration}
      style={{backgroundColor: toastColor || Colors.header}}>
      <RNCText
        style={{
          fontSize: FontSize.font14,
          fontFamily: FontFamily.SemiBold,
          color: toastTextColor || Colors.WText,
        }}>
        {toastMessage}
      </RNCText>
    </Snackbar>
  );
};

export default RNCToast;

const styles = StyleSheet.create({});
