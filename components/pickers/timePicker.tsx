import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Platform, View } from 'react-native';

export default function datePicker() {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (_event: any, selectedTime?: Date) => {
    setShow(Platform.OS === 'ios'); // stays visible on iOS
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <View>
      <Button title="Start Time" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          display="spinner" // <-- this gives the iOS wheel
          onChange={onChange}
        />
      )}
    </View>
  );
}
