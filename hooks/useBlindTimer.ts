import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { BLIND_LEVELS, BREAK_DURATION_MINUTES, DEFAULT_LEVEL_MINUTES } from '@/constants/blindLevels';

interface UseBlindTimerOptions {
  autoStart?: boolean;
}

const VOICE_KEY = 'announcement_voice';
let selectedVoice: string | undefined = undefined;

export async function setAnnouncementVoice(voiceId: string) {
  selectedVoice = voiceId;
  await AsyncStorage.setItem(VOICE_KEY, voiceId);
}

function announce(index: number) {
  const level = BLIND_LEVELS[index];
  const text = level.isBreak
    ? 'Break time. 10 minutes. A 20 dollar add-on is available.'
    : `Blinds are ${level.smallBlind} and ${level.bigBlind}.`;
  Speech.stop();
  Speech.speak(text, { rate: 0.9, voice: selectedVoice });
}

function announceWarning(currentIndex: number) {
  if (currentIndex + 1 >= BLIND_LEVELS.length) return;
  Speech.stop();
  Speech.speak('Blinds will go up in one minute.', { rate: 0.9, voice: selectedVoice });
}

export function useBlindTimer({ autoStart }: UseBlindTimerOptions = {}) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_LEVEL_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [levelDuration, setLevelDuration] = useState(DEFAULT_LEVEL_MINUTES);
  const [hasStarted, setHasStarted] = useState(false);
  const [isBreakExpired, setIsBreakExpired] = useState(false);
  const autoStartFiredRef = useRef(false);

  const currentLevelIndexRef = useRef(currentLevelIndex);
  const levelDurationRef = useRef(levelDuration);
  currentLevelIndexRef.current = currentLevelIndex;
  levelDurationRef.current = levelDuration;

  useEffect(() => {
    AsyncStorage.getItem(VOICE_KEY).then(saved => {
      if (saved) selectedVoice = saved;
    });
  }, []);

  useEffect(() => {
    if (autoStart && !hasStarted && !autoStartFiredRef.current) {
      autoStartFiredRef.current = true;
      setHasStarted(true);
      setIsRunning(true);
      announce(0);
    }
  }, [autoStart]);

  const durationForIndex = (index: number) =>
    BLIND_LEVELS[index].isBreak ? BREAK_DURATION_MINUTES * 60 : levelDurationRef.current * 60;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === 61) announceWarning(currentLevelIndexRef.current);
        if (prev > 1) return prev - 1;

        const currentIndex = currentLevelIndexRef.current;

        // Break expired — stop and wait for manual resume
        if (BLIND_LEVELS[currentIndex].isBreak) {
          setIsRunning(false);
          setIsBreakExpired(true);
          return 0;
        }

        // Auto-advance to next level
        const nextIndex = currentIndex + 1;
        if (nextIndex < BLIND_LEVELS.length) {
          setCurrentLevelIndex(nextIndex);
          announce(nextIndex);
          return durationForIndex(nextIndex);
        }

        // Tournament over
        setIsRunning(false);
        Speech.speak('The tournament is over. Good game everyone.');
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggle = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsRunning(true);
      announce(0);
    } else if (isBreakExpired) {
      const nextIndex = currentLevelIndexRef.current + 1;
      if (nextIndex < BLIND_LEVELS.length) {
        setCurrentLevelIndex(nextIndex);
        setTimeRemaining(levelDurationRef.current * 60);
        setIsBreakExpired(false);
        setIsRunning(true);
        announce(nextIndex);
      }
    } else {
      setIsRunning(prev => !prev);
    }
  };

  const nextLevel = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < BLIND_LEVELS.length) {
      setCurrentLevelIndex(nextIndex);
      setTimeRemaining(durationForIndex(nextIndex));
      setIsBreakExpired(false);
      announce(nextIndex);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentLevelIndex(0);
    setTimeRemaining(levelDuration * 60);
    setHasStarted(false);
    setIsBreakExpired(false);
    Speech.stop();
  };

  const updateLevelDuration = (minutes: number) => {
    const clamped = Math.max(1, Math.min(60, minutes));
    setLevelDuration(clamped);
    if (!BLIND_LEVELS[currentLevelIndex].isBreak) {
      setTimeRemaining(clamped * 60);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const buttonLabel = !hasStarted
    ? '▶  Start'
    : isBreakExpired || !isRunning
    ? '▶  Resume'
    : '⏸  Pause';

  return {
    currentLevel: BLIND_LEVELS[currentLevelIndex],
    currentLevelIndex,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    isBreakExpired,
    levelDuration,
    buttonLabel,
    handleToggle,
    nextLevel,
    resetTimer,
    updateLevelDuration,
    totalLevels: BLIND_LEVELS.length,
  };
}
