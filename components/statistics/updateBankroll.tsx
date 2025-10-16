import React, { useState, useEffect } from 'react';
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from '../../backend/firebaseConfig'


// Function that updates our bankroll when handleSaveGame is called
export async function updateBankroll(profitLoss: number) {
    const bankrollRef = doc(db, "bankroll", "main");
    const currentBankRoll = await getDoc(bankrollRef)

    if (currentBankRoll.exists()) {
    const data = currentBankRoll.data();
    const currentTotal= (data.total as number) || 0;
    const updatedTotal = currentTotal + profitLoss
    await updateDoc(bankrollRef, { total: updatedTotal})
    }
};