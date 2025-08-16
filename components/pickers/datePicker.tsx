import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


interface datePickerModalProps {
    visible: boolean;
    date: Date,
    onChangeDate: (date: Date) => void;
    onClose: () => void;
}

export default function datePicker({
  visible,
  date,
  onChangeDate,
  onClose,
}: datePickerModalProps) {
  const onChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChangeDate(selectedDate);
    }
  }
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <DateTimePicker
            value={date}
            mode="date"
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
    alignItems: 'center',
    width: '100%'
  },
  modal: {
    backgroundColor: 'white',
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center'
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