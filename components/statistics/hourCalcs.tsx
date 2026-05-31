import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../../backend/firebaseConfig';


const [bankroll, setBankroll] = useState(0);
const [hourlyEarning, setHourlyEarning] = useState(0);
const [tournamentEarnings, setTournamentEarnings] = useState(0);

// Where all calculations around our hourly go
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