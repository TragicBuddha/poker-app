import { Picker } from '@react-native-picker/picker';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';


interface locationPickerModalProps {
    visible: boolean;
    options: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    onClose: () => void;
}

export default function locationPicker({
    visible,
    options,
    selectedValue,
    onValueChange,
    onClose,
}: locationPickerModalProps) {
    return (
      
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
              <View style={styles.backgroundOverlay} />
           </TouchableWithoutFeedback>
          <View style={styles.modal}>
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
    borderRadius: 30,
  },
});