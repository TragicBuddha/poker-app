import BlindTimer from '@/components/timer/BlindTimer';
import LastSignedInQR from '@/components/LastSignedInQR';
import EndGameModal from '@/components/modals/EndGameModal';
import { db } from '@/services/firebaseConfig';
import { useCurrentSession } from '@/hooks/useCurrentSession';
import { useRoster } from '@/hooks/useRoster';
import { Player } from '@/hooks/useRoster';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, FlatList, ImageBackground, Modal,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

interface TournamentModalProps {
  isVisible: boolean;
  onClose: () => void;
  playerCount: number;
  autoStart?: boolean;
}

type LateRegMode = 'new' | 'returning';

const TournamentModal: React.FC<TournamentModalProps> = ({ isVisible, onClose, playerCount, autoStart }) => {
  const [lateRegOpen, setLateRegOpen] = useState(false);
  const [endGameVisible, setEndGameVisible] = useState(false);
  const [mode, setMode] = useState<LateRegMode>('new');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastLateReg, setLastLateReg] = useState<Player | null>(null);
  const todaySessionId = new Date().toISOString().split('T')[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { session, sessionPlayers, signedInIds, addPlayerToSession, endGame, updateSession } = useCurrentSession();
  const { players } = useRoster();

  const handleEndGame = () => {
    Alert.alert(
      'End Game',
      'Are you sure you want to end the game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Game', style: 'destructive', onPress: () => setEndGameVisible(true) },
      ]
    );
  };

  const notSignedIn = players.filter(p => !signedInIds.includes(p.id));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: lateRegOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    if (!lateRegOpen) {
      setFirstName('');
      setLastName('');
      setMode('new');
    }
  }, [lateRegOpen]);

  const handleNewSignIn = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Missing Info', 'Please enter first and last name.');
      return;
    }
    try {
      setSaving(true);
      const ref = await addDoc(collection(db, 'players'), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        lifetimeFinishes: [],
      });
      await addPlayerToSession(ref.id, firstName.trim(), lastName.trim());
      setLastLateReg({ id: ref.id, firstName: firstName.trim(), lastName: lastName.trim(), lifetimeFinishes: [] });
      setLateRegOpen(false);
    } catch {
      Alert.alert('Error', 'Could not sign in. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReturningSignIn = async (player: Player) => {
    await addPlayerToSession(player.id, player.firstName, player.lastName);
    setLastLateReg(player);
    setLateRegOpen(false);
  };

  return (
    <Modal animationType="fade" visible={isVisible} onRequestClose={onClose}>
      <ImageBackground
        source={require('../../assets/images/app_background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* End Game button */}
        <TouchableOpacity onPress={handleEndGame} style={styles.endGameButton}>
          <Text style={styles.endGameText}>End Game</Text>
        </TouchableOpacity>

        {/* Top-left: player count + late reg button */}
        <View style={styles.topLeft}>
          <Text style={styles.playerCount}>{playerCount} Players</Text>
          {!lateRegOpen && (
            <TouchableOpacity onPress={() => setLateRegOpen(true)} style={styles.lateRegButton}>
              <Text style={styles.lateRegButtonText}>+ Late Reg</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Fade-in late reg form */}
        <Animated.View style={[styles.lateRegForm, { opacity: fadeAnim }, !lateRegOpen && styles.hidden]}>

          {/* Mode toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              onPress={() => setMode('new')}
              style={[styles.toggleBtn, mode === 'new' && styles.toggleActive]}
            >
              <Text style={styles.toggleText}>New Player</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('returning')}
              style={[styles.toggleBtn, mode === 'returning' && styles.toggleActive]}
            >
              <Text style={styles.toggleText}>Returning</Text>
            </TouchableOpacity>
          </View>

          {mode === 'new' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleNewSignIn}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity
                  onPress={handleNewSignIn}
                  style={[styles.goodLuckBtn, saving && styles.btnDisabled]}
                  disabled={saving}
                >
                  <Text style={styles.goodLuckText}>{saving ? '...' : 'Good Luck!'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLateRegOpen(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <FlatList
                data={notSignedIn}
                keyExtractor={p => p.id}
                style={styles.playerList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Everyone is already in!</Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.playerRow}
                    onPress={() => handleReturningSignIn(item)}
                  >
                    <Text style={styles.playerRowText}>{item.lastName}, {item.firstName}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setLateRegOpen(false)} style={styles.cancelBtnFull}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        {/* Last late reg QR */}
        {lastLateReg && !lateRegOpen && (
          <View style={styles.qrArea}>
            <LastSignedInQR
              lastPlayer={lastLateReg}
              signedInPlayers={players.filter(p => signedInIds.includes(p.id))}
              sessionId={todaySessionId}
              onDismiss={() => setLastLateReg(null)}
            />
          </View>
        )}

        {/* Timer */}
        <View style={styles.content}>
          <BlindTimer
            autoStart={autoStart}
            onSync={state => updateSession({
              timerLevelIndex: state.levelIndex,
              timerLevelDuration: state.levelDuration,
              timerTimeRemaining: state.timeRemaining,
              timerIsRunning: state.isRunning,
              timerIsBreakExpired: state.isBreakExpired,
              timerSyncedAt: new Date().toISOString(),
            })}
          />
        </View>
      </ImageBackground>

      <EndGameModal
        isVisible={endGameVisible}
        onClose={() => setEndGameVisible(false)}
        sessionPlayers={sessionPlayers}
        session={session}
        onFinalize={async (positions, winnerId, bountyEliminated, bountyEliminatorId, womensClaimed, womensWinnerId) => {
          await endGame(positions, winnerId, bountyEliminated, bountyEliminatorId, womensClaimed, womensWinnerId);
          setEndGameVisible(false);
          setTimeout(() => onClose(), 400);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  endGameButton: {
    position: 'absolute',
    top: 44,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(192,57,43,0.85)',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  endGameText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  topLeft: {
    position: 'absolute',
    top: 44,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 10,
  },
  playerCount: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  lateRegButton: {
    backgroundColor: 'rgba(39,174,96,0.85)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  lateRegButtonText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  lateRegForm: {
    position: 'absolute',
    top: 100,
    left: 24,
    width: 300,
    backgroundColor: 'rgba(0,0,0,0.88)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    zIndex: 10,
  },
  hidden: { pointerEvents: 'none' },
  toggle: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  toggleActive: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  toggleText: { color: 'white', fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: 'white',
    fontSize: 17,
    marginBottom: 10,
  },
  formButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  goodLuckBtn: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: 'rgba(39,174,96,0.4)' },
  goodLuckText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },
  cancelBtnFull: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },
  cancelText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  playerList: { maxHeight: 200, marginBottom: 4 },
  playerRow: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  playerRowText: { color: 'white', fontSize: 16 },
  emptyText: { color: 'rgba(255,255,255,0.45)', fontSize: 14, textAlign: 'center', paddingVertical: 12 },
  qrArea: {
    position: 'absolute',
    top: 100,
    left: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
});

export default TournamentModal;
