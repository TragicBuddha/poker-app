import { db } from '@/services/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  lifetimeFinishes: number[];
}

export function useRoster() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'players'), snapshot => {
      const list: Player[] = snapshot.docs
        .map(doc => ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          lifetimeFinishes: doc.data().lifetimeFinishes ?? [],
        }))
        .sort((a, b) =>
          a.lastName.localeCompare(b.lastName) ||
          a.firstName.localeCompare(b.firstName)
        );
      setPlayers(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { players, loading };
}
