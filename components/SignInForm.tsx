import { db } from '@/services/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SignInFormProps {
  onSignedIn?: (playerId: string, firstName: string, lastName: string) => void;
}

export default function SignInForm({ onSignedIn }: SignInFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSignIn = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Missing Info', 'Please enter both first and last name.');
      return;
    }

    try {
      setSaving(true);
      const ref = await addDoc(collection(db, 'players'), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        lifetimeFinishes: [],
      });
      setFirstName('');
      setLastName('');
      onSignedIn?.(ref.id, firstName.trim(), lastName.trim());
    } catch (error) {
      Alert.alert('Error', 'Could not sign in. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Player</Text>
      <Text style={styles.subtitle}>Starting stack: $25</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="rgba(255,255,255,0.5)"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="rgba(255,255,255,0.5)"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={handleSignIn}
      />

      <TouchableOpacity
        onPress={handleSignIn}
        style={[styles.button, saving && styles.buttonDisabled]}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Signing In...' : 'Good Luck!'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
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
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    color: 'white',
    fontSize: 20,
    marginBottom: 14,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(39,174,96,0.5)',
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
