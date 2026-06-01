import BankrollChart from '@/components/charts/bankrollChart';
import { usePokerStats } from '@/hooks/usePokerStats';
import React from 'react';
import { Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// Defines our modal
interface StatsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ isVisible, onClose }) => {
// Rendering our modal

    const {
        bankroll,
        hourlyEarning,
        tournamentTotal,
        cashTotal,
    } = usePokerStats();

    return (
    // Opening Modal and setting top wrapper as image background
    <Modal 
        animationType='fade'
        visible={isVisible} 
        onRequestClose={onClose}>
        <ImageBackground source={require('../../assets/images/app_background.png')} style={styles.background}>
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
                <Text style={styles.hourlyTitle}>Hourly Earnings: ${hourlyEarning.toFixed(2)}/HR</Text>
                <Text style={styles.tournamentTitle}>Tournament Earnings: ${tournamentTotal}</Text>
                <View style={styles.chartContainer}>
                    <BankrollChart
                        bankroll={bankroll}
                        tournamentEarnings={tournamentTotal}
                        cashEarnings={bankroll - tournamentTotal}
                        radius={150}
                        strokeWidth={25}
                        tournamentColor='black'
                        cashColor='white'
                    />
                </View>
            </View>
        </ImageBackground>
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
    marginTop: 30,
    paddingTop: 40,
    height: '100%',
    borderColor: 'black',
    borderWidth: 2,
    },

    chartContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    
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
    paddingBottom: 50,
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