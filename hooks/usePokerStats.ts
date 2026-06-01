import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../backend/firebaseConfig';


export function usePokerStats() {
    const [bankroll, setBankroll] = useState(0);
    const [hourlyEarning, setHourlyEarning] = useState(0);
    const [tournamentTotal, setTournamentTotal] = useState(0);
    const [cashTotal, setCashTotal] = useState(0);

    useEffect(() => {
        const bankrollRef = doc(db, "bankroll", "main");
        const unsubscribeBankroll = onSnapshot(bankrollRef, (docSnap) => {
            if (docSnap.exists()) setBankroll(docSnap.data().total);
        });

        const gamesCollectionRef = collection(db, "games");
        const unsubscribeGames = onSnapshot(gamesCollectionRef, (snapshot) => {

            {/*Calculations section, where all the functions will go */}

            const hoursArray = snapshot.docs
                .map(doc => doc.data().hoursPlayed || 0);

            const totalHours = hoursArray.reduce((acc, curr) => acc + curr, 0);
        
            const totalProfit = snapshot.docs
                .map(doc => doc.data().profitLoss || 0)
                .reduce((acc, curr) => acc + curr, 0);

            const hourly = totalHours > 0 ? totalProfit / totalHours : 0;

            const tournamentTotal = snapshot.docs
                .filter(docs => docs.data().gameType === "TOURNAMENT")
                .map(doc => doc.data().profitLoss || 0)
                .reduce((acc, curr) => acc + curr, 0);

            const cashTotal = snapshot.docs
                .filter(docs => docs.data().gameType === "CASH")
                .map(doc => doc.data().profitLoss || 0)
                .reduce((acc, curr) => acc + curr, 0)

            setHourlyEarning(hourly);
            setTournamentTotal(tournamentTotal);
            setCashTotal(cashTotal);

        });

        // Anything in return statement unloads when the component closes (when we close the app in this use)
        return () => {
        unsubscribeBankroll();
        //unsubscribeGames();
        };
    }, []);

    return {
        bankroll, 
        hourlyEarning, 
        tournamentTotal,
        cashTotal
    }
}