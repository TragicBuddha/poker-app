import { Session, SessionPlayer } from '@/hooks/useCurrentSession';
import React, { useState } from 'react';
import {
  Alert, FlatList, ImageBackground, Modal, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

interface EndGameModalProps {
  isVisible: boolean;
  onClose: () => void;
  sessionPlayers: SessionPlayer[];
  session: Session | null;
  onFinalize: (
    finalPositions: { playerId: string; position: number }[],
    winnerId: string,
    bountyEliminated: boolean,
    bountyEliminatorId: string | null,
    womensBountyClaimed: boolean,
    womensBountyWinnerId: string | null,
  ) => Promise<void>;
}

interface PickerConfig {
  title: string;
  players: SessionPlayer[];
  onSelect: (player: SessionPlayer) => void;
}

const POSITIONS = [
  { label: '1st Place', position: 1 },
  { label: '2nd Place', position: 2 },
  { label: 'Bubble (6th)', position: 6 },
];

const EndGameModal: React.FC<EndGameModalProps> = ({
  isVisible, onClose, sessionPlayers, session, onFinalize,
}) => {
  const [assigned, setAssigned] = useState<Record<number, string>>({});
  const [bountyEliminated, setBountyEliminated] = useState<boolean | null>(null);
  const [bountyEliminatorId, setBountyEliminatorId] = useState<string | null>(null);
  const [womensClaimed, setWomensClaimed] = useState<boolean | null>(null);
  const [womensWinnerId, setWomensWinnerId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<PickerConfig | null>(null);

  const playerName = (id: string) => {
    const p = sessionPlayers.find(p => p.id === id);
    return p ? `${p.firstName} ${p.lastName}` : '—';
  };

  const openPositionPicker = (position: number, label: string) => {
    const taken = Object.entries(assigned)
      .filter(([pos]) => parseInt(pos) !== position)
      .map(([, id]) => id);
    const available = sessionPlayers.filter(p => !taken.includes(p.id));
    setPicker({
      title: `Who finished ${label}?`,
      players: available,
      onSelect: (player) => {
        setAssigned(prev => ({ ...prev, [position]: player.id }));
        setPicker(null);
      },
    });
  };

  const openBountyPicker = () => {
    setPicker({
      title: 'Who got the bounty?',
      players: sessionPlayers,
      onSelect: (player) => {
        setBountyEliminatorId(player.id);
        setPicker(null);
      },
    });
  };

  const openWomensPicker = () => {
    setPicker({
      title: "Who won the women's bounty?",
      players: sessionPlayers,
      onSelect: (player) => {
        setWomensWinnerId(player.id);
        setPicker(null);
      },
    });
  };

  const clearPosition = (position: number) => {
    setAssigned(prev => {
      const next = { ...prev };
      delete next[position];
      return next;
    });
  };

  const handleFinalize = async () => {
    if (!assigned[1]) {
      Alert.alert('Missing', 'Please assign 1st place.');
      return;
    }
    if (bountyEliminated === null) {
      Alert.alert('Missing', 'Please resolve the bounty.');
      return;
    }
    if (womensClaimed === null) {
      Alert.alert('Missing', "Please resolve the women's bounty.");
      return;
    }

    const finalPositions = Object.entries(assigned).map(([pos, id]) => ({
      playerId: id,
      position: parseInt(pos),
    }));

    try {
      setSaving(true);
      await onFinalize(
        finalPositions,
        assigned[1],
        bountyEliminated,
        bountyEliminatorId,
        womensClaimed,
        womensWinnerId,
      );
    } catch {
      Alert.alert('Error', 'Could not save game results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <ImageBackground
        source={require('../../assets/images/app_background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕ Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.header}>End Game</Text>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Finish Positions ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Finish Positions</Text>
            {POSITIONS.map(({ label, position }) => (
              <View key={position} style={styles.positionBlock}>
                <Text style={styles.positionLabel}>{label}</Text>
                {assigned[position] ? (
                  <View style={styles.assignedRow}>
                    <Text style={styles.assignedName}>{playerName(assigned[position])}</Text>
                    <TouchableOpacity onPress={() => clearPosition(position)} style={styles.clearBtn}>
                      <Text style={styles.clearBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => openPositionPicker(position, label)}
                    style={styles.selectBtn}
                  >
                    <Text style={styles.selectBtnText}>Select Player</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* ── Bounty ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bounty</Text>
            <Text style={styles.ruleText}>
              {session?.bountyPlayerName
                ? `Bounty on: ${session.bountyPlayerName} ($${session.bountyTotal})`
                : 'No bounty player set.'}
            </Text>
            <Text style={styles.label}>Was the bounty claimed?</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setBountyEliminated(true)}
                style={[styles.toggleBtn, bountyEliminated === true && styles.toggleActive]}
              >
                <Text style={styles.toggleText}>Yes — Claimed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setBountyEliminated(false); setBountyEliminatorId(null); }}
                style={[styles.toggleBtn, bountyEliminated === false && styles.toggleInactive]}
              >
                <Text style={styles.toggleText}>No — Carry Over</Text>
              </TouchableOpacity>
            </View>
            {bountyEliminated === true && (
              <>
                <Text style={styles.label}>Who got the bounty?</Text>
                {bountyEliminatorId ? (
                  <View style={styles.assignedRow}>
                    <Text style={styles.assignedName}>{playerName(bountyEliminatorId)}</Text>
                    <TouchableOpacity onPress={() => setBountyEliminatorId(null)} style={styles.clearBtn}>
                      <Text style={styles.clearBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={openBountyPicker} style={styles.selectBtn}>
                    <Text style={styles.selectBtnText}>Select Player</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* ── Women's Bounty ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Women's Bounty</Text>
            <Text style={styles.ruleText}>Amount: ${session?.womensBounty ?? 20}</Text>
            <Text style={styles.label}>Was the women's bounty claimed?</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setWomensClaimed(true)}
                style={[styles.toggleBtn, womensClaimed === true && styles.toggleActive]}
              >
                <Text style={styles.toggleText}>Yes — Claimed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setWomensClaimed(false); setWomensWinnerId(null); }}
                style={[styles.toggleBtn, womensClaimed === false && styles.toggleInactive]}
              >
                <Text style={styles.toggleText}>No — Carry Over</Text>
              </TouchableOpacity>
            </View>
            {womensClaimed === true && (
              <>
                <Text style={styles.label}>Who got the women's bounty?</Text>
                {womensWinnerId ? (
                  <View style={styles.assignedRow}>
                    <Text style={styles.assignedName}>{playerName(womensWinnerId)}</Text>
                    <TouchableOpacity onPress={() => setWomensWinnerId(null)} style={styles.clearBtn}>
                      <Text style={styles.clearBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={openWomensPicker} style={styles.selectBtn}>
                    <Text style={styles.selectBtnText}>Select Player</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* ── Finalize ── */}
          <TouchableOpacity
            onPress={handleFinalize}
            style={[styles.finalizeBtn, saving && styles.finalizeBtnDisabled]}
            disabled={saving}
          >
            <Text style={styles.finalizeBtnText}>{saving ? 'Saving...' : '🏆 Finalize Game'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>

      {/* ── Player Picker Overlay ── */}
      <Modal
        visible={!!picker}
        transparent
        animationType="slide"
        onRequestClose={() => setPicker(null)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>{picker?.title}</Text>
            <FlatList
              data={picker?.players ?? []}
              keyExtractor={p => p.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerRow}
                  onPress={() => picker?.onSelect(item)}
                >
                  <Text style={styles.pickerRowText}>{item.lastName}, {item.firstName}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setPicker(null)} style={styles.pickerCancel}>
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  closeBtn: { position: 'absolute', top: 44, right: 24, zIndex: 10 },
  closeBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 17 },
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
  positionBlock: { marginBottom: 14 },
  positionLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 6 },
  assignedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  assignedName: { color: '#2ecc71', fontSize: 18, fontWeight: 'bold', flex: 1 },
  clearBtn: { padding: 6 },
  clearBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 18 },
  selectBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  selectBtnText: { color: 'white', fontSize: 16 },
  ruleText: { color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 10, fontStyle: 'italic' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 8, marginTop: 10 },
  toggleRow: { flexDirection: 'row', gap: 12 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  toggleActive: { backgroundColor: 'rgba(39,174,96,0.45)', borderColor: '#27ae60' },
  toggleInactive: { backgroundColor: 'rgba(192,57,43,0.45)', borderColor: '#c0392b' },
  toggleText: { color: 'white', fontWeight: '600', fontSize: 15 },
  finalizeBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  finalizeBtnDisabled: { backgroundColor: 'rgba(255,215,0,0.4)' },
  finalizeBtnText: { color: 'black', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerSheet: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  pickerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerRow: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  pickerRowText: { color: 'white', fontSize: 18 },
  pickerCancel: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  pickerCancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 17 },
});

export default EndGameModal;
