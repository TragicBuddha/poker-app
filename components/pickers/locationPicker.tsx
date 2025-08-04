import { Picker } from '@react-native-picker/picker';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


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