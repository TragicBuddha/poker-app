import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';


interface timePickerModalProps {
  visible: boolean;
  time: Date,
  onChangeTime: (time: Date) => void;
  onClose: () => void;
}
export default function timePicker({
  visible,
  time,
  onChangeTime,
  onClose,
}: timePickerModalProps) {
  const onChange = (_event: any, selectedTime?: Date) => {
    if (selectedTime) {
      onChangeTime(selectedTime);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={onChange}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundOverlay: {
  flex: 1,
  },
  modal: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '90%',
    height: 200,
    bottom: 50,
    left: 1,
    borderRadius: 30,
  },
});
