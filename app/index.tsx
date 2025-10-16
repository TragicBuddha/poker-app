import { View, Image, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react'
import AddGameModal from '../components/newGameModal';
import { collection, getDoc, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from '../backend/firebaseConfig'
import BankrollChart from '../components/charts/bankrollChart';


export default function HomeScreen() {
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [bankroll, setBankroll] = useState(0)
  const [hourlyEarning, setHourlyEarning] = useState(0)
  const [tournamentEarnings, setTournamentEarnings] = useState(0)

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

      const tournamentTotal = snapshot.docs
        .filter(doc => doc.data().gameType === "TOURNAMENT")
        .map(doc => doc.data().profitLoss || 0)
        .reduce((acc, curr) => acc + curr, 0);
      setTournamentEarnings(tournamentTotal);
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
        <Text style={styles.hourlyTitle}>Cash Earnings: ${hourlyEarning}/HR</Text>
        <Text style={styles.tournamentTitle}>Tournament Earnings: ${tournamentEarnings}</Text>
      </View>
      <View style={styles.chartContainer}>
        <BankrollChart
          bankroll={bankroll}
          tournamentEarnings={tournamentEarnings}
          cashEarnings={bankroll - tournamentEarnings}
          radius={150}
          strokeWidth={25}
          tournamentColor='black'
          cashColor='white'
        />
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
    //borderWidth: 2,
    //borderColor: 'black'
  },
  chartContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    marginTop: 0,
    marginBottom: 200,
    //borderColor: 'black',
    //borderWidth: 2
  },

  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    bottom: 45,
    //borderWidth: 2,
    //borderColor: 'black'
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
    //borderWidth: 2,
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
  }
});
