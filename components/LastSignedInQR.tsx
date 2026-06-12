import { Player } from '@/hooks/useRoster';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const WEB_BASE_URL = 'https://poker-app-ba63f.web.app';

interface LastSignedInQRProps {
  lastPlayer: Player | null;
  signedInPlayers: Player[];
  sessionId: string;
  onDismiss?: () => void;
}

export default function LastSignedInQR({ lastPlayer, signedInPlayers, sessionId, onDismiss }: LastSignedInQRProps) {
  const [selected, setSelected] = useState<Player | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    setSelected(null);
    if (!lastPlayer || !onDismiss) return;
    const t = setTimeout(onDismiss, 45000);
    return () => clearTimeout(t);
  }, [lastPlayer]);

  const player = selected ?? lastPlayer;

  if (!player) return null;

  const url = `${WEB_BASE_URL}/?pid=${player.id}&sid=${sessionId}`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Player QR Code</Text>
      <Text style={styles.name}>{player.firstName} {player.lastName}</Text>

      <View style={styles.qrWrapper}>
        <QRCode value={url} size={180} backgroundColor="white" color="black" />
      </View>

      <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.changeBtn}>
        <Text style={styles.changeBtnText}>Change Player ↓</Text>
      </TouchableOpacity>

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Player</Text>
            <FlatList
              data={signedInPlayers}
              keyExtractor={p => p.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerRow, player.id === item.id && styles.pickerRowActive]}
                  onPress={() => { setSelected(item); setPickerVisible(false); }}
                >
                  <Text style={styles.pickerRowText}>{item.lastName}, {item.firstName}</Text>
                  {player.id === item.id && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
  },
  changeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
  },
  changeBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '70%',
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  pickerTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  pickerRow: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerRowActive: { backgroundColor: 'rgba(255,215,0,0.1)' },
  pickerRowText: { color: 'white', fontSize: 16 },
  checkmark: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
});
