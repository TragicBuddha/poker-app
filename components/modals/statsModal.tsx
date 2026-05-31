import React from 'react';
import { Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



// Defines our modal
interface StatsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ isVisible, onClose }) => {
// Rendering our modal 
// Rendering our modal 
  return (
    // Opening Modal and setting top wrapper as image background
    <Modal 
        animationType='fade'
        visible={isVisible} 
        onRequestClose={onClose}>
        <ImageBackground source={require('../../assets/images/app_background.png')} style={styles.background}></ImageBackground>
        {/* Back Button */}
        <TouchableOpacity onPress={() => {
        onClose();}}
        style={styles.backButtonContainer}>
        <View style={styles.backButton}>
            <Image
            source={require('../../assets/images/exit_button.png')}
            style={styles.backButtonImage}
            />
            <Text style={styles.backButtonText}>Back</Text>
        </View>
        </TouchableOpacity>
    </Modal>
  );
};

// Styling of modal
const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        paddingTop: 100,
    },

    backButtonContainer: {
        position: 'absolute',
        top: 40,
        right: 20,
    },

    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backButtonImage: {
        height: 70, 
        width: 70, 
    },

    backButtonText: {
        fontFamily: 'ComicNeue-Font', 
        fontSize: 16,
        color: 'white',
        marginTop: 0,
    },



})

export default StatsModal;