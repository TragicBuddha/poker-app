import { View, Image, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react'
import AddGameModal from '../components/newGameModal';
import { collection, getDoc, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from '/Users/hj/Desktop/ReactNative/poker-app/app/backend/firebaseConfig'


export default function HomeScreen() {
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [bankroll, setBankroll] = useState(0)
  const [hourlyEarning, setHourlyEarning] = useState(0)

  // UNDERSTANDING NEEDED
  // Gathering stats and db information
  useEffect(() => {
    const bankrollRef = doc(db, "bankroll", "main");
    const unsubscribeBankroll = onSnapshot(bankrollRef, (docSnap) => {
      if (docSnap.exists()) setBankroll(docSnap.data().total);
    });

    const gamesCollectionRef = collection(db, "games");
    const unsubscribeGames = onSnapshot(gamesCollectionRef, (snapshot) => {
      const hoursArray = snapshot.docs.map(doc => doc.data().hoursPlayed || 0);
      const totalHours = hoursArray.reduce((acc, curr) => acc + curr, 0);

      const totalProfit = snapshot.docs
        .map(doc => doc.data().profitLoss || 0)
        .reduce((acc, curr) => acc + curr, 0);

      const hourly = totalHours > 0 ? totalProfit / totalHours : 0;
      setHourlyEarning(hourly);
    });

    return () => {
      unsubscribeBankroll();
      unsubscribeGames();
    };
  }, []);

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
      source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/app_background.png')}
      style={styles.container}
    >
      <View style={styles.statContainer}>
        <Text style={styles.bankrollTitle}> Bankroll: ${bankroll.toFixed(2)}</Text>
        <Text style={styles.hourlyTitle}>Current Hourly: ${hourlyEarning}/HR</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleGameModal}>
          <Image
            style={styles.addNewGameButton}
            source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/entry_tab_icon.png')}
          />
          <Text style={styles.addNewGameTitle}>New Game</Text>
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
    paddingTop: 110,
    height: 720,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    bottom: 45
    //borderWidth: 2,
    //borderColor: 'black'
  },

  bankrollTitle: {
    fontSize: 30,
  },

  hourlyTitle: {
    fontSize: 30,
  },

  addNewGameButton: {
    height: 150,
    width: 200,
    //borderWidth: 2,
  },

  addNewGameTitle: {
    fontSize: 28,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 10,
    width: 160,
    left: 22,
  }
});
