import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');

  const handleDownload = async () => {
    if (!city || !type) {
      Alert.alert('Champs requis', 'Veuillez remplir les deux champs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, type })
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', data.message);
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur de requête :', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.title}>Téléchargement de données offline</Text>

        <Text style={styles.label}>Nom de la ville</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Marrakesh"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Type de données</Text>
        <TextInput
          style={styles.input}
          placeholder="graphml, tiles, both"
          value={type}
          onChangeText={setType}
        />

        <Button title="Télécharger" onPress={handleDownload} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
});
