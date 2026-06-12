import { BLIND_LEVELS, TOTAL_LEVELS } from '@/constants/blindLevels';
import { useBlindTimer } from '@/hooks/useBlindTimer';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BlindTimerProps {
  onSync?: (state: {
    levelIndex: number;
    levelDuration: number;
    timeRemaining: number;
    isRunning: boolean;
    isBreakExpired: boolean;
  }) => void;
  autoStart?: boolean;
}

export default function BlindTimer({ onSync, autoStart }: BlindTimerProps) {
  const {
    currentLevel,
    currentLevelIndex,
    timeRemaining,
    formattedTime,
    isRunning,
    isBreakExpired,
    levelDuration,
    buttonLabel,
    handleToggle,
    nextLevel,
    resetTimer,
    updateLevelDuration,
    totalLevels,
  } = useBlindTimer({ autoStart });

  const syncRef = useRef(onSync);
  syncRef.current = onSync;

  // Sync on level change, start/pause, break expiry — not every second
  useEffect(() => {
    syncRef.current?.({ levelIndex: currentLevelIndex, levelDuration, timeRemaining, isRunning, isBreakExpired });
  }, [currentLevelIndex, isRunning, isBreakExpired]);

  // Periodic sync every 30s while running to keep web page accurate
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      syncRef.current?.({ levelIndex: currentLevelIndex, levelDuration, timeRemaining, isRunning, isBreakExpired });
    }, 30000);
    return () => clearInterval(interval);
  }, [isRunning, currentLevelIndex]);

  const nextLevelData = currentLevelIndex + 1 < totalLevels ? BLIND_LEVELS[currentLevelIndex + 1] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.levelLabel}>
        {currentLevel.isBreak ? 'BREAK' : `Level ${currentLevel.levelNumber} of ${TOTAL_LEVELS}`}
      </Text>

      {currentLevel.isBreak ? (
        <Text style={styles.breakText}>$20 Add-on Available</Text>
      ) : (
        <Text style={styles.blindsText}>
          ${currentLevel.smallBlind} / ${currentLevel.bigBlind}
        </Text>
      )}

      <Text style={styles.timerText}>{formattedTime}</Text>

      {nextLevelData && (
        <Text style={styles.nextText}>
          Up Next: {nextLevelData.isBreak ? 'BREAK' : `$${nextLevelData.smallBlind} / $${nextLevelData.bigBlind}`}
        </Text>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleToggle}
          style={[styles.controlButton, isRunning && !isBreakExpired ? styles.pauseButton : styles.startButton]}
        >
          <Text style={styles.controlButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextLevel} style={[styles.controlButton, styles.nextButton]}>
          <Text style={styles.controlButtonText}>Next ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.durationRow}>
        <TouchableOpacity onPress={() => updateLevelDuration(levelDuration - 1)} style={styles.durationStepper}>
          <Text style={styles.durationStepperText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.durationText}>{levelDuration} min / level</Text>
        <TouchableOpacity onPress={() => updateLevelDuration(levelDuration + 1)} style={styles.durationStepper}>
          <Text style={styles.durationStepperText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 40,
    width: '100%',
  },
  levelLabel: {
    color: '#FFD700',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  blindsText: {
    color: 'white',
    fontSize: 110,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  breakText: {
    color: '#FFD700',
    fontSize: 70,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timerText: {
    color: 'white',
    fontSize: 200,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  nextText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 42,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 18,
    justifyContent: 'center',
  },
  controlButton: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButton: { backgroundColor: '#27ae60' },
  pauseButton: { backgroundColor: '#e67e22' },
  nextButton: { backgroundColor: '#2980b9' },
  controlButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  durationStepper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationStepperText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  durationText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 18,
    minWidth: 120,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(192,57,43,0.7)',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
