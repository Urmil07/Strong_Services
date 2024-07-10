import React, {useEffect, useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import dayjs, {Dayjs} from 'dayjs';

import {Colors} from '@Constants';
import DateTimePicker from 'react-native-ui-datepicker';
import {DateType} from 'react-native-ui-datepicker/lib/typescript/src/types';
import {Functions} from '@Utils';
import normalize from 'react-native-normalize';

interface DatePickerModalProps {
  visible: boolean;
  value: Dayjs;
  handleChange: (params: {date: DateType}) => void;
  setVisible: (visible: boolean) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  value = dayjs(),
  handleChange,
  setVisible,
}) => {
  if (visible)
    return (
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
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
              // date={date}
              date={value}
              // minDate={MinDate}
              // maxDate={MaxDate}
              // onChange={({date}) => setDate(dayjs(date))}
              onChange={handleChange}
              selectedTextStyle={{color: Colors.WText}}
              calendarTextStyle={{color: Colors.Text}}
              headerTextStyle={{color: Colors.Black}}
              weekDaysTextStyle={{color: Colors.Black}}
              todayTextStyle={{color: Colors.Black}}
              timePickerTextStyle={{color: Colors.Black}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
};

export default DatePickerModal;
