// components/BankrollDonutChart.tsx
import { CurrentRenderContext } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {G, Circle} from 'react-native-svg'


interface BankrollChartProps {
  bankroll: number;
  tournamentEarnings: number;
  cashEarnings: number;
  radius: number;
  strokeWidth: number;
  tournamentColor: string;
  cashColor: string;
}

export default function BankrollChart({ bankroll, tournamentEarnings, cashEarnings, radius, strokeWidth, tournamentColor, cashColor }: BankrollChartProps) {
  const tournamentPercentage = (tournamentEarnings / bankroll) * 100;
  const cashPercentage = (cashEarnings / bankroll) * 100;
  const circumference = 2 * Math.PI * radius;
  const tournamentOffset = circumference - (circumference * tournamentPercentage) / 100;

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}>
        <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
          {/* Base circle */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#eee"
            fill="transparent"
          />
          {/* Tournament slice */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth={strokeWidth}
            stroke={tournamentColor}
            strokeDasharray={circumference}
            strokeDashoffset={tournamentOffset}
            fill="transparent"
            strokeLinecap="square"
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Bankroll: ${bankroll}</Text>
        <Text style={[styles.text, {color: 'white'}]}>Cash: {cashPercentage.toFixed(0)}%</Text>
        <Text style={styles.text}>Tournament: {tournamentPercentage.toFixed(0)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150 * 2,
    height: 150 * 2,
    justifyContent: 'center',
    //borderWidth: 2,
    //borderColor: 'black'
  },

  text: { 
    flexDirection: 'column', 
    alignSelf: 'center', 
    fontWeight: 'bold', 
    fontSize: 20
  }
})