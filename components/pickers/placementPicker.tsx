import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Text, } from 'react-native';
import { Picker } from '@react-native-picker/picker';


interface placementPickerModalProps {
    visible: boolean;
    options: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    onClose: () => void;
}

export default function placementPicker({
    visible,
    options,
    selectedValue,
    onValueChange,
    onClose,
}: placementPickerModalProps) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backgroundOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modal}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={styles.backgroundOverlay} />
            </TouchableWithoutFeedback>
            <Picker
              selectedValue={selectedValue}
              onValueChange={onValueChange}
            >
              {options.map((option) => (
                <Picker.Item label={option} value={option} key={option} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  backgroundOverlay: {
  flex: 1,
},
  modal: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: '90%',
    height: 200,
    bottom: 50,
    left: 1,
    borderRadius: 30,
  },
});