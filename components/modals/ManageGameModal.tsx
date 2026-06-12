import { Session, SessionPlayer } from '@/hooks/useCurrentSession';
import { Player } from '@/hooks/useRoster';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground, Modal, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

interface ManageGameModalProps {
  isVisible: boolean;
  onClose: () => void;
  session: Session | null;
  sessionPlayers: SessionPlayer[];
  allPlayers: Player[];
  playerCount: number;
  onUpdate: (updates: Partial<Omit<Session, 'id' | 'date'>>) => Promise<void>;
}

const ManageGameModal: React.FC<ManageGameModalProps> = ({
  isVisible, onClose, session, sessionPlayers, allPlayers, playerCount, onUpdate,
}) => {
  const [prizePool, setPrizePool] = useState('');
  const [firstPct, setFirstPct] = useState('');
  const [secondPct, setSecondPct] = useState('');
  const [bubblePayout, setBubblePayout] = useState('');
  const [bountyTotal, setBountyTotal] = useState('');
  const [bountyPlayerName, setBountyPlayerName] = useState('');
  const [bountyPresent, setBountyPresent] = useState(false);
  const [womensBounty, setWomensBounty] = useState('');
  const [showBountyPicker, setShowBountyPicker] = useState(false);

  useEffect(() => {
    if (session) {
      setPrizePool(String(session.totalPrizePool));
      setFirstPct(String(session.firstPlacePct));
      setSecondPct(String(session.secondPlacePct));
      setBubblePayout(String(session.bubblePayout));
      setBountyTotal(String(session.bountyTotal));
      setBountyPlayerName(session.bountyPlayerName ?? '');
      setBountyPresent(session.bountyPlayerPresent);
      setWomensBounty(String(session.womensBounty));
    }
  }, [session]);

  const save = async (updates: Partial<Omit<Session, 'id' | 'date'>>) => {
    await onUpdate(updates);
  };

  const firstPlaceAmount = Math.round((parseFloat(prizePool) || 0) * (parseFloat(firstPct) || 70) / 100);
  const secondPlaceAmount = Math.round((parseFloat(prizePool) || 0) * (parseFloat(secondPct) || 30) / 100);

  return (
    <Modal animationType="fade" visible={isVisible} onRequestClose={onClose}>
      <ImageBackground
        source={require('../../assets/images/app_background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>✕ Close</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Manage Game</Text>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Game Info ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Info</Text>
            <Text style={styles.infoRow}>Date: {session?.date ?? '—'}</Text>
            <Text style={styles.infoRow}>Players signed in: {playerCount}</Text>
            <Text style={styles.label}>Prize Pool ($)</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                value={prizePool}
                onChangeText={setPrizePool}
                keyboardType="numbers-and-punctuation"
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={() => save({ totalPrizePool: parseFloat(prizePool) || 0 })}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Prize Payouts ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prize Payouts</Text>
            <Text style={styles.label}>1st Place %</Text>
            <View style={styles.row}>
              <TextInput style={styles.input} value={firstPct} onChangeText={setFirstPct} keyboardType="numbers-and-punctuation" placeholderTextColor="rgba(255,255,255,0.4)" />
              <Text style={styles.calculated}>= ${firstPlaceAmount}</Text>
              <TouchableOpacity style={styles.saveBtn} onPress={() => save({ firstPlacePct: parseFloat(firstPct) || 70 })}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>2nd Place %</Text>
            <View style={styles.row}>
              <TextInput style={styles.input} value={secondPct} onChangeText={setSecondPct} keyboardType="numbers-and-punctuation" placeholderTextColor="rgba(255,255,255,0.4)" />
              <Text style={styles.calculated}>= ${secondPlaceAmount}</Text>
              <TouchableOpacity style={styles.saveBtn} onPress={() => save({ secondPlacePct: parseFloat(secondPct) || 30 })}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Bubble (6th place) $</Text>
            <View style={styles.row}>
              <TextInput style={styles.input} value={bubblePayout} onChangeText={setBubblePayout} keyboardType="numbers-and-punctuation" placeholderTextColor="rgba(255,255,255,0.4)" />
              <TouchableOpacity style={styles.saveBtn} onPress={() => save({ bubblePayout: parseFloat(bubblePayout) || 50 })}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Bounty ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounty</Text>
            <Text style={styles.ruleText}>
              Previous game winner. If eliminated after break, eliminator collects. If they make the money, they keep it. If absent, bounty carries over.
            </Text>
            <Text style={styles.label}>Bounty Player</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowBountyPicker(!showBountyPicker)}>
              <Text style={styles.pickerButtonText}>{bountyPlayerName || 'Select player'}</Text>
            </TouchableOpacity>
            {showBountyPicker && (
              <View style={styles.playerList}>
                {allPlayers.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.playerRow}
                    onPress={() => {
                      const name = `${p.firstName} ${p.lastName}`;
                      setBountyPlayerName(name);
                      save({ bountyPlayerId: p.id, bountyPlayerName: name });
                      setShowBountyPicker(false);
                    }}
                  >
                    <Text style={styles.playerRowText}>{p.lastName}, {p.firstName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text style={styles.label}>Bounty Amount ($)</Text>
            <View style={styles.row}>
              <TextInput style={styles.input} value={bountyTotal} onChangeText={setBountyTotal} keyboardType="numbers-and-punctuation" placeholderTextColor="rgba(255,255,255,0.4)" />
              <TouchableOpacity style={styles.saveBtn} onPress={() => save({ bountyTotal: parseFloat(bountyTotal) || 20 })}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Bounty Player Confirmation ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounty Player Confirmation</Text>
            <Text style={styles.label}>
              Is <Text style={styles.highlight}>{bountyPlayerName || 'the bounty player'}</Text> here tonight?
            </Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, bountyPresent && styles.toggleBtnActive]}
                onPress={() => { setBountyPresent(true); save({ bountyPlayerPresent: true }); }}
              >
                <Text style={styles.toggleBtnText}>Yes — They're Here</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !bountyPresent && styles.toggleBtnInactive]}
                onPress={() => { setBountyPresent(false); save({ bountyPlayerPresent: false }); }}
              >
                <Text style={styles.toggleBtnText}>No — Carry Over</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Women's Bounty ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Women's Bounty</Text>
            <Text style={styles.ruleText}>
              Must eliminate the last woman to make the final table after the break, and make the final table yourself.
            </Text>
            <Text style={styles.label}>Women's Bounty Amount ($)</Text>
            <View style={styles.row}>
              <TextInput style={styles.input} value={womensBounty} onChangeText={setWomensBounty} keyboardType="numbers-and-punctuation" placeholderTextColor="rgba(255,255,255,0.4)" />
              <TouchableOpacity style={styles.saveBtn} onPress={() => save({ womensBounty: parseFloat(womensBounty) || 20 })}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  backButton: { position: 'absolute', top: 44, right: 24, zIndex: 10 },
  backText: { color: 'white', fontSize: 18, fontWeight: '600' },
  header: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    letterSpacing: 2,
  },
  scroll: { paddingHorizontal: 30, paddingBottom: 60 },
  section: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    letterSpacing: 1,
  },
  infoRow: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 8 },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 6, marginTop: 10 },
  ruleText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 18,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: 'white',
    fontSize: 18,
  },
  calculated: { color: '#FFD700', fontSize: 16, minWidth: 60 },
  saveBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  pickerButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  pickerButtonText: { color: 'white', fontSize: 17 },
  playerList: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    marginBottom: 10,
    maxHeight: 200,
  },
  playerRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  playerRowText: { color: 'white', fontSize: 16 },
  toggleRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toggleBtnActive: { backgroundColor: 'rgba(39,174,96,0.5)', borderColor: '#27ae60' },
  toggleBtnInactive: { backgroundColor: 'rgba(192,57,43,0.5)', borderColor: '#c0392b' },
  toggleBtnText: { color: 'white', fontWeight: '600', fontSize: 15 },
  highlight: { color: '#FFD700', fontWeight: 'bold' },
});

export default ManageGameModal;
