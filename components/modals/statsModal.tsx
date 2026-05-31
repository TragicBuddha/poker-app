import React from 'react';
import { Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import hourlyEarning from hourCals;
import tournamentEarnings from hourCals;
w


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
            {/* Stats Information Top View*/}
            <View style={styles.statContainer}>
                <Text style={styles.hourlyTitle}>Cash Earnings: ${hourlyEarning}/HR</Text>
                <Text style={styles.tournamentTitle}>Tournament Earnings: ${tournamentEarnings}</Text>
            </View>
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

    container: {
    flex:1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    },

    statContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 85,
    paddingTop: 40,
    height: 200,
    },

    backButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    },


    hourlyTitle: {
    fontSize: 30,
    },

    tournamentTitle: {
    fontSize: 30,
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