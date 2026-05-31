import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../backend/firebaseConfig';
import BankrollChart from '../components/charts/bankrollChart';
import StatsModal from '../components/modals/statsModal';
import AddGameModal from '../components/newGameModal';


export default function HomeScreen() {
  // useState is React's fiber tree (a table) for things we want to render, gives us the ability to re-render on the fly
  // Variable declarations
  const [gameModalVisible, setGameModalVisible] = useState(false);
  // Not setup yet
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [bankroll, setBankroll] = useState(0);
  const [hourlyEarning, setHourlyEarning] = useState(0);
  const [tournamentEarnings, setTournamentEarnings] = useState(0);

  // useEffect = will run everything inside when component loads (at start for this use)
  useEffect(() => {
    // Real-time listener from firestore, is listening for bankroll data from firestore *READ FIRESTORE DOC/CERT.*
    // bankrollRef = address reference to bankroll data
    // unsubscribeBankroll = onSnapshot will fetch data and start listening, then returns function that turns off the listener when var is called 
    const bankrollRef = doc(db, "bankroll", "main");
    const unsubscribeBankroll = onSnapshot(bankrollRef, (docSnap) => {
      if (docSnap.exists()) setBankroll(docSnap.data().total);
    });

    // Real-time listener from firestore, is listening for bankroll data from firestore *READ FIRESTORE DOC/CERT.*
    // gamesCollectionRef = address reference to data on for all games
    // unsubscribeGames = onSnapshot will fetch data and start listening, then returns function that turns off the listener when var is called 
    const gamesCollectionRef = collection(db, "games");
    const unsubscribeGames = onSnapshot(gamesCollectionRef, (snapshot) => {

      //*CALCULATION SECTION* Is here so it can continue to update as firestore listens
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

    // Anything in return statement unloads when the component closes (when we close the app in this use)
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
      source={require('../assets/images/app_background.png')}
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
  statContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 85,
    paddingTop: 40,
    height: 200,
  },
  chartContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    marginTop: 0,
    marginBottom: 200,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 150,
    bottom: 45,
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
