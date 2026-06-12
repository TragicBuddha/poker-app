import LastSignedInQR from '@/components/LastSignedInQR';
import ReturningPlayers from '@/components/ReturningPlayers';
import SignInForm from '@/components/SignInForm';
import ManageGameModal from '@/components/modals/ManageGameModal';
import TournamentModal from '@/components/modals/TournamentModal';
import { useCurrentSession } from '@/hooks/useCurrentSession';
import { Player, useRoster } from '@/hooks/useRoster';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [tournamentVisible, setTournamentVisible] = useState(false);
  const [manageVisible, setManageVisible] = useState(false);
  const [lastSignedIn, setLastSignedIn] = useState<Player | null>(null);
  const [webAutoStart, setWebAutoStart] = useState(false);
  const prevGameActiveRef = useRef<boolean>(false);
  const todaySessionId = new Date().toISOString().split('T')[0];

  const { players, loading } = useRoster();
  const { session, sessionPlayers, signedInIds, playerCount, addPlayerToSession, removePlayerFromSession, updateSession, resetSession } = useCurrentSession();

  useEffect(() => {
    const isNowActive = session?.gameActive ?? false;
    if (isNowActive && !prevGameActiveRef.current) {
      setTournamentVisible(true);
      setWebAutoStart(true);
    }
    prevGameActiveRef.current = isNowActive;
  }, [session?.gameActive]);

  const handleNewGame = () => {
    Alert.alert(
      'New Game?',
      'This will delete the session and remove all signed-in players.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'New Game', style: 'destructive', onPress: async () => {
            await resetSession();
            setLastSignedIn(null);
          }
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/app_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Eric's Monday Mayhem</Text>

      <View style={styles.body}>
        <View style={styles.column}>
          <SignInForm
            onSignedIn={(id, firstName, lastName) => {
              addPlayerToSession(id, firstName, lastName);
              setLastSignedIn({ id, firstName, lastName, lifetimeFinishes: [] });
            }}
          />
          <LastSignedInQR
            lastPlayer={lastSignedIn}
            signedInPlayers={players.filter(p => signedInIds.includes(p.id))}
            sessionId={todaySessionId}
            onDismiss={() => setLastSignedIn(null)}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.column}>
          <ReturningPlayers
            players={players}
            loading={loading}
            signedInIds={signedInIds}
            onSelect={player => {
              addPlayerToSession(player.id, player.firstName, player.lastName);
              setLastSignedIn(player);
            }}
            onRemove={player => removePlayerFromSession(player.id)}
            onShowQR={player => setLastSignedIn(player)}
          />
        </View>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={() => setManageVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Manage Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNewGame} style={[styles.button, styles.newGameButton]}>
          <Text style={[styles.buttonText, styles.newGameText]}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTournamentVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>

      <ManageGameModal
        isVisible={manageVisible}
        onClose={() => setManageVisible(false)}
        session={session}
        sessionPlayers={sessionPlayers}
        allPlayers={players}
        playerCount={playerCount}
        onUpdate={updateSession}
      />
      <TournamentModal
        isVisible={tournamentVisible}
        onClose={() => { setTournamentVisible(false); setWebAutoStart(false); }}
        playerCount={playerCount}
        autoStart={webAutoStart}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  title: {
    color: '#FFD700',
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    gap: 30,
  },
  column: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,215,0,0.2)',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 30,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  newGameButton: {
    borderColor: 'rgba(192,57,43,0.6)',
  },
  newGameText: {
    color: 'rgba(220,80,60,1)',
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
