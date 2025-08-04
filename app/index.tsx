import { View, Image, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import AddGameModal from '../components/newGameModal';

export default function HomeScreen() {
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const toggleGameModal = () => {
    setGameModalVisible(!gameModalVisible);
  };
  const toggleStatsModal = () => {
    setStatsModalVisible(!statsModalVisible);
  };


  return (
    <ImageBackground
      source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/app_background.png')}
      style={styles.container}
    >
      <View style={styles.statContainer}>
        <Text style={styles.bankrollTitle}>Bankroll: $153.75</Text>
        <Text style={styles.hourlyTitle}>Current Hourly: $35.00/HR</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleGameModal}>
          <Image
            style={styles.addNewGameButton}
            source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/entry_tab_icon.png')}
          />
        </TouchableOpacity>
        <AddGameModal
          isVisible={gameModalVisible}
          onClose={toggleGameModal}
        ></AddGameModal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  statContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    paddingTop: 110,
    height: 720,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: 'black',
    height: 200,
  },
  bankrollTitle: {
    fontSize: 30,
  },
  hourlyTitle: {
    fontSize: 30,
  },
  addNewGameButton: {
    height: 200,
    width: 200,
  },
});
