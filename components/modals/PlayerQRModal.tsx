import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface PlayerQRModalProps {
  isVisible: boolean;
  onClose: () => void;
  playerName: string;
  url: string;
}

const PlayerQRModal: React.FC<PlayerQRModalProps> = ({ isVisible, onClose, playerName, url }) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.name}>{playerName}</Text>
          <Text style={styles.subtitle}>Scan to open your dashboard</Text>
          <View style={styles.qrWrapper}>
            <QRCode value={url} size={240} backgroundColor="white" color="black" />
          </View>
          <Text style={styles.url} numberOfLines={1}>{url}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    width: '70%',
  },
  name: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
  },
  url: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginBottom: 24,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  closeBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlayerQRModal;
