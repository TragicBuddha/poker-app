import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function datePicker() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // stays visible on iOS
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View>
      <Button title="Select Date" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner" // <-- this gives the iOS wheel
          onChange={onChange}
        />
      )}
    </View>
  );
}
