import AddGameModal from '@/components/modals/newGameModal';
import StatsModal from '@/components/modals/statsModal';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  // useState is React's fiber tree (a table) for things we want to render, gives us the ability to re-render on the fly
  // Variable declarations
  const [gameModalVisible, setGameModalVisible] = useState(false);
  // Not setup yet
  const [statsModalVisible, setStatsModalVisible] = useState(false);

  // Toggle functions for displaying components
  const toggleGameModal = () => {
    setGameModalVisible(!gameModalVisible);
  };
  const toggleStatsModal = () => {
    setStatsModalVisible(!statsModalVisible);
  };

  // JSX Render, displays and layers our components onto the screen
  return (
    <ImageBackground
      source={require('../assets/images/app_background.png')}
      style={styles.container}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleStatsModal}>
          <Image style={styles.statsButton} source={require('../assets/images/stats_button.png')}/>
          <Text style={styles.statsTitle}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleGameModal}>
          <Image style={styles.addNewGameButton} source={require('../assets/images/entry_tab_icon.png')}/>
          <Text style={styles.addNewGameTitle}>New Game</Text>
        </TouchableOpacity>
        <AddGameModal
          isVisible={gameModalVisible}
          onClose={toggleGameModal}
        ></AddGameModal>
        <StatsModal
          isVisible={statsModalVisible}
          onClose={toggleStatsModal}
        ></StatsModal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 150,
    top: 675,
    borderWidth: 2,
    borderColor: 'black'
  },

  bankrollTitle: {
    fontSize: 30,
  },

  hourlyTitle: {
    fontSize: 30,
  },

  tournamentTitle: {
    fontSize: 30,
  },

  addNewGameButton: {
    height: 150,
    width: 200,
    borderWidth: 2,
    borderColor: 'black'
  },

  addNewGameTitle: {
    fontSize: 28,
    textAlign: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: 160,
    left: 22,
  },
  
  statsButton: {
    height: 165,
    width: 200,
    bottom: 7,
    borderWidth: 2,
    borderColor: 'black'
  },

  statsTitle: {
    fontSize: 28,
    textAlign: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: 160,
    left: 15,
    bottom: 5,
  },
});
