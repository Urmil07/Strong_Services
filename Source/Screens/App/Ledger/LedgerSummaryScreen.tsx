import {StyleSheet, Text, View} from 'react-native';

import {GetLedgerSummary} from 'Reducers';
import React from 'react';
import {useAppDispatch} from '@ReduxHook';
import {useFocusEffect} from '@react-navigation/native';

const LedgerSummaryScreen = () => {
  const dispatch = useAppDispatch();
  useFocusEffect(() => {
    dispatch(GetLedgerSummary());
  });
  return (
    <View>
      <Text>LedgerSummaryScreen</Text>
    </View>
  );
};

export default LedgerSummaryScreen;

const styles = StyleSheet.create({});
