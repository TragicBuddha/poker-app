import React, { useState, useEffect } from 'react';
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from '/Users/hj/Desktop/ReactNative/poker-app/app/backend/firebaseConfig'


// Function that calculates our total hours played
export async function calculateHours()
    const totalHoursCalc = (startTime: Date | null, endTime: Date | null) => {
        if (startTime && endTime && endTime < startTime) {
        const msInDay = 24 * 60 * 60 * 1000;
        const endTimeFix = new Date(endTime.getTime() + msInDay);
        const milSecDiff = endTimeFix.getTime() - startTime.getTime();
        const hours = milSecDiff / 1000 / 60 / 60;
        return Math.round(hours);
        } else if (startTime && endTime) {
        const milSecDiff = endTime.getTime() - startTime.getTime();
        const hours = milSecDiff / 1000 / 60 / 60;
        return Math.round(hours);
        }
    }