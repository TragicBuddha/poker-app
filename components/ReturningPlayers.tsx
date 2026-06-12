import { Player } from '@/hooks/useRoster';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReturningPlayersProps {
  players: Player[];
  loading: boolean;
  signedInIds: string[];
  onSelect: (player: Player) => void;
  onRemove: (player: Player) => void;
  onShowQR: (player: Player) => void;
}

export default function ReturningPlayers({ players, loading, signedInIds, onSelect, onRemove, onShowQR }: ReturningPlayersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Returning Player?</Text>
      <Text style={styles.subtitle}>Tap your name</Text>

      {loading ? (
        <ActivityIndicator color="#FFD700" size="large" style={{ marginTop: 20 }} />
      ) : players.length === 0 ? (
        <Text style={styles.empty}>No players yet</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const signedIn = signedInIds.includes(item.id);
            return (
              <TouchableOpacity
                onPress={() => signedIn ? onRemove(item) : onSelect(item)}
                style={[styles.row, signedIn && styles.rowSignedIn]}
                activeOpacity={0.7}
              >
                <Text style={[styles.name, signedIn && styles.nameSignedIn]}>
                  {item.lastName}, {item.firstName}
                </Text>
                {signedIn && (
                  <View style={styles.rowRight}>
                    <TouchableOpacity
                      onPress={(e) => { e.stopPropagation?.(); onShowQR(item); }}
                      style={styles.qrButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.qrIcon}>⬛</Text>
                    </TouchableOpacity>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginBottom: 16,
  },
  list: {
    width: '100%',
  },
  row: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSignedIn: {
    backgroundColor: 'rgba(39,174,96,0.4)',
    borderColor: '#27ae60',
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  nameSignedIn: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qrButton: {
    padding: 2,
  },
  qrIcon: {
    fontSize: 18,
  },
  checkmark: {
    color: '#2ecc71',
    fontSize: 22,
    fontWeight: 'bold',
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    marginTop: 20,
  },
});
