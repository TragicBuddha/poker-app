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
      <Text style={styles.bankrollTitle}>Bankroll: $153.75</Text>
      <Text style={styles.hourlyTitle}>Current Hourly: $35.00/HR</Text>
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

        <TouchableOpacity>
          <Image
            style={styles.seeStatsButton}
            source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/stats_tab_icon.png')}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  bankrollTitle: {
    fontSize: 30,
    position: "absolute",
    top: 110,
    left: 35,
  },
  hourlyTitle: {
    fontSize: 30,
    position: "absolute",
    top: 160,
    left: 35,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 675,
    borderWidth: 2,
    borderColor: 'black'
  },
  addNewGameButton: {
    height: 100,
    width: 100,
  },
  seeStatsButton: {
    height: 100,
    width: 100,
  },
});
