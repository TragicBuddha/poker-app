import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';


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
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={onChange}
            style={{ backgroundColor: 'white' }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  closeText: {
    fontSize: 16,
  },
});
