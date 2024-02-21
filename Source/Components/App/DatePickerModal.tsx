import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '@Constants';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import normalize from 'react-native-normalize';
import {Functions} from '@Utils';

const DatePickerModal = ({visible}: {visible: boolean}) => {
  const [date, setDate] = useState(dayjs());
  const [MinDate, setMinDate] = useState(dayjs());
  const [MaxDate, setMaxDate] = useState(dayjs());

  useEffect(() => {
    const CurrentYear = Functions.getCurrentFinancialYear();
    const Year = CurrentYear.split('-');
    setMinDate(dayjs(`${Year[0]}-04-01`));
    setMaxDate(dayjs(`${Year[1]}-03-31`));
  }, []);

  if (visible)
    return (
      <View
        style={{
          backgroundColor: Colors.Black + 99,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: normalize(10),
        }}>
        <View
          style={{
            backgroundColor: Colors.background,
            padding: normalize(10),
            borderRadius: 12,
          }}>
          <DateTimePicker
            mode="single"
            dayContainerStyle={{borderRadius: 8}}
            firstDayOfWeek={1}
            selectedItemColor={Colors.header}
            todayContainerStyle={{borderColor: Colors.header}}
            date={date}
            minDate={MinDate}
            maxDate={MaxDate}
            onChange={({date}) => setDate(dayjs(date))}
          />
        </View>
      </View>
    );
};

export default DatePickerModal;

const styles = StyleSheet.create({});
