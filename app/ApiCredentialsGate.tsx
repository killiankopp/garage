import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getApiUrl, getBearerToken, saveApiUrl, saveBearerToken, clearApiCredentials } from './apiCredentials';

export default function ApiCredentialsGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [bearerToken, setBearerTokenState] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const url = await getApiUrl();
      const token = await getBearerToken();
      setApiUrl(url);
      setBearerTokenState(token);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await saveApiUrl(inputUrl);
    await saveBearerToken(inputToken);
    setApiUrl(inputUrl);
    setBearerTokenState(inputToken);
    setEditing(false);
    setLoading(false);
  };

  const handleEdit = async () => {
    setInputUrl(apiUrl || '');
    setInputToken(bearerToken || '');
    setEditing(true);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!apiUrl || !bearerToken || editing) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>URL de API :</Text>
        <TextInput
          style={styles.input}
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="https://mon-api.com"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Bearer Token :</Text>
        <TextInput
          style={styles.input}
          value={inputToken}
          onChangeText={setInputToken}
          placeholder="token..."
          autoCapitalize="none"
          secureTextEntry
        />
        <Button title="Enregistrer" onPress={handleSave} disabled={!inputUrl || !inputToken} />
        {(apiUrl && bearerToken) && (
          <Button title="Annuler" onPress={() => setEditing(false)} color="#888" />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      <View style={styles.editButton}>
        <Button title="Paramètres" onPress={handleEdit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    left: 70,
    right: 70,
  },
});

