import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../backend/firebaseConfig';


export function usePokerStats() {
    const [bankroll, setBankroll] = useState(0);
    const [hourlyEarning, setHourlyEarning] = useState(0);
    const [tournamentEarnings, setTournamentEarnings] = useState(0);

    useEffect(() => {
        const bankrollRef = doc(db, "bankroll", "main");
        const unsubscribeBankroll = onSnapshot(bankrollRef, (docSnap) => {
            if (docSnap.exists()) setBankroll(docSnap.data().total);
        })
    })
}