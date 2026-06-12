import { db } from '@/services/firebaseConfig';
import { arrayUnion, collection, deleteDoc, doc, getDocs, getDoc, increment, onSnapshot, runTransaction, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface SessionPlayer {
  id: string;
  firstName: string;
  lastName: string;
  chipStack: number;
  isEliminated: boolean;
  finalPosition: number | null;
  hasBounty: boolean;
}

export interface Session {
  id: string;
  date: string;
  isEnded: boolean;
  totalPrizePool: number;
  firstPlacePct: number;
  secondPlacePct: number;
  bubblePayout: number;
  bountyTotal: number;
  bountyPlayerId: string | null;
  bountyPlayerName: string | null;
  bountyPlayerPresent: boolean;
  bountyEliminated: boolean;
  bountyEliminatorId: string | null;
  womensBounty: number;
  winnerId: string | null;
  timerLevelIndex: number;
  timerLevelDuration: number;
  timerTimeRemaining: number;
  timerIsRunning: boolean;
  timerIsBreakExpired: boolean;
  timerSyncedAt: string | null;
  gameActive: boolean;
}

const todayId = () => new Date().toISOString().split('T')[0];

const SESSION_DEFAULTS = {
  totalPrizePool: 0,
  firstPlacePct: 70,
  secondPlacePct: 30,
  bubblePayout: 50,
  bountyTotal: 20,
  bountyPlayerId: null,
  bountyPlayerName: null,
  bountyPlayerPresent: false,
  bountyEliminated: false,
  bountyEliminatorId: null,
  womensBounty: 20,
  winnerId: null,
  endedAt: null,
  timerLevelIndex: 0,
  timerLevelDuration: 15,
  timerTimeRemaining: 900,
  timerIsRunning: false,
  timerIsBreakExpired: false,
  timerSyncedAt: null,
  gameActive: false,
};

export function useCurrentSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionPlayers, setSessionPlayers] = useState<SessionPlayer[]>([]);
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    const sessionId = todayId();

    const unsubSession = onSnapshot(doc(db, 'sessions', sessionId), snap => {
      if (snap.exists()) {
        const d = snap.data();
        const ended = !!d.endedAt;
        setSessionEnded(ended);
        setSession({
          id: snap.id,
          date: d.date,
          isEnded: ended,
          totalPrizePool: d.totalPrizePool ?? 0,
          firstPlacePct: d.firstPlacePct ?? 70,
          secondPlacePct: d.secondPlacePct ?? 30,
          bubblePayout: d.bubblePayout ?? 50,
          bountyTotal: d.bountyTotal ?? 20,
          bountyPlayerId: d.bountyPlayerId ?? null,
          bountyPlayerName: d.bountyPlayerName ?? null,
          bountyPlayerPresent: d.bountyPlayerPresent ?? false,
          bountyEliminated: d.bountyEliminated ?? false,
          bountyEliminatorId: d.bountyEliminatorId ?? null,
          womensBounty: d.womensBounty ?? 20,
          winnerId: d.winnerId ?? null,
          timerLevelIndex: d.timerLevelIndex ?? 0,
          timerLevelDuration: d.timerLevelDuration ?? 15,
          timerTimeRemaining: d.timerTimeRemaining ?? 900,
          timerIsRunning: d.timerIsRunning ?? false,
          timerIsBreakExpired: d.timerIsBreakExpired ?? false,
          timerSyncedAt: d.timerSyncedAt ?? null,
          gameActive: d.gameActive ?? false,
        });
      } else {
        setSessionEnded(false);
        setSession(null);
      }
    });

    const unsubPlayers = onSnapshot(
      collection(db, 'sessions', sessionId, 'players'),
      snap => {
        setSessionPlayers(
          snap.docs.map(d => ({
            id: d.id,
            firstName: d.data().firstName,
            lastName: d.data().lastName,
            chipStack: d.data().chipStack ?? 25,
            isEliminated: d.data().isEliminated ?? false,
            finalPosition: d.data().finalPosition ?? null,
            hasBounty: d.data().hasBounty ?? false,
          }))
        );
      }
    );

    return () => {
      unsubSession();
      unsubPlayers();
    };
  }, []);

  const addPlayerToSession = async (
    playerId: string,
    firstName: string,
    lastName: string
  ) => {
    const sessionId = todayId();
    const sessionRef = doc(db, 'sessions', sessionId);
    const snap = await getDoc(sessionRef);

    const isNew = !snap.exists() || snap.data()?.endedAt;

    if (isNew) {
      // Create fresh session — first player's $20 baked in directly
      await setDoc(sessionRef, {
        date: sessionId,
        ...SESSION_DEFAULTS,
        totalPrizePool: 20,
        createdAt: serverTimestamp(),
      });
    } else {
      // Existing active session — just increment
      await updateDoc(sessionRef, { totalPrizePool: increment(20) });
    }

    await setDoc(doc(db, 'sessions', sessionId, 'players', playerId), {
      firstName,
      lastName,
      chipStack: 25,
      isEliminated: false,
      finalPosition: null,
      hasBounty: false,
    });
  };

  const removePlayerFromSession = async (playerId: string) => {
    const sessionId = todayId();
    await deleteDoc(doc(db, 'sessions', sessionId, 'players', playerId));
    const sessionRef = doc(db, 'sessions', sessionId);
    await runTransaction(db, async tx => {
      const snap = await tx.get(sessionRef);
      if (snap.exists()) {
        const current = snap.data().totalPrizePool ?? 0;
        tx.update(sessionRef, { totalPrizePool: Math.max(0, current - 20) });
      }
    });
  };

  const updateSession = async (updates: Partial<Omit<Session, 'id' | 'date' | 'isEnded'>>) => {
    await updateDoc(doc(db, 'sessions', todayId()), updates);
  };

  const endGame = async (
    finalPositions: { playerId: string; position: number }[],
    winnerId: string,
    bountyEliminated: boolean,
    bountyEliminatorId: string | null,
    womensBountyClaimed: boolean,
    womensBountyWinnerId: string | null,
  ) => {
    const sessionId = todayId();
    const batch = writeBatch(db);

    batch.update(doc(db, 'sessions', sessionId), {
      endedAt: serverTimestamp(),
      winnerId,
      bountyEliminated,
      bountyEliminatorId,
      womensBountyClaimed,
      womensBountyWinnerId,
    });

    for (const { playerId, position } of finalPositions) {
      batch.update(doc(db, 'sessions', sessionId, 'players', playerId), {
        finalPosition: position,
      });
      batch.update(doc(db, 'players', playerId), {
        lifetimeFinishes: arrayUnion(position),
      });
    }

    await batch.commit();
  };

  const resetSession = async () => {
    const sessionId = todayId();
    const playersSnap = await getDocs(collection(db, 'sessions', sessionId, 'players'));
    const batch = writeBatch(db);
    playersSnap.docs.forEach(d => batch.delete(d.ref));
    batch.delete(doc(db, 'sessions', sessionId));
    await batch.commit();
  };

  // If session is ended, no one is considered signed in
  const signedInIds = sessionEnded ? [] : sessionPlayers.map(p => p.id);
  const playerCount = sessionEnded ? 0 : sessionPlayers.length;

  return { session, sessionPlayers, signedInIds, playerCount, addPlayerToSession, removePlayerFromSession, updateSession, endGame, resetSession };
}
