import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Text} from 'react-native';
import { Picker } from '@react-native-picker/picker';


interface blindsPickerModalProps {
    visible: boolean;
    options: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    onClose: () => void;
}

export default function blindsPicker({
    visible,
    options,
    selectedValue,
    onValueChange,
    onClose,
}: blindsPickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.overlay}>
              <View style={styles.modal}>
                  <Picker
                      selectedValue={selectedValue}
                      onValueChange={onValueChange}
                  >
                  {options.map((option) => (
                      <Picker.Item label={option} value={option} key={option} />
                  ))}
                  </Picker>
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
  },
  modal: {
    backgroundColor: 'white',
    paddingBottom: 20,
    width: '100%',
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