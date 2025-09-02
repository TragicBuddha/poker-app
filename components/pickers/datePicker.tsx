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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <DateTimePicker
            value={date}
            mode="date"
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