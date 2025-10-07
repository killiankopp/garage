import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import {
  getApiUrl,
  getBearerToken,
  saveApiUrl,
  saveBearerToken,
  getOpeningTime,
  getClosingTime,
  saveOpeningTime,
  saveClosingTime
} from '@/utils/apiCredentials';
import { Button } from "../components";
import { GateService, ApiError } from "@/services";

interface ApiStatus {
  isHealthy: boolean;
  error?: string;
  lastChecked?: Date;
}

export default function ApiCredentialsGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [bearerToken, setBearerTokenState] = useState<string | null>(null);
  const [openingTime, setOpeningTime] = useState<number | null>(null);
  const [closingTime, setClosingTime] = useState<number | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [inputOpeningTime, setInputOpeningTime] = useState('');
  const [inputClosingTime, setInputClosingTime] = useState('');
  const [editing, setEditing] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ isHealthy: false });
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Fonction pour vérifier le statut de l'API avec useCallback
  const checkApiStatus = useCallback(async (): Promise<void> => {
    if (!apiUrl || !bearerToken) return;

    setCheckingStatus(true);
    try {
      const isHealthy = await GateService.isApiHealthy();
      setApiStatus({
        isHealthy,
        lastChecked: new Date(),
        error: undefined
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Erreur de connexion';

      setApiStatus({
        isHealthy: false,
        error: errorMessage,
        lastChecked: new Date()
      });
      // Pas besoin de re-lancer l'exception ici car on gère l'erreur localement
    } finally {
      setCheckingStatus(false);
    }
  }, [apiUrl, bearerToken]);

  useEffect(() => {
    (async () => {
      const url = await getApiUrl();
      const token = await getBearerToken();
      const openTime = await getOpeningTime();
      const closeTime = await getClosingTime();

      setApiUrl(url);
      setBearerTokenState(token);
      setOpeningTime(openTime);
      setClosingTime(closeTime);
      setLoading(false);

      // Vérifier le statut de l'API si les credentials sont disponibles
      if (url && token) {
        await checkApiStatus();
      }
    })();
  }, [checkApiStatus]);

  // Vérifier le statut quand les credentials changent
  useEffect(() => {
    if (apiUrl && bearerToken && !editing) {
      checkApiStatus();
    }
  }, [apiUrl, bearerToken, editing, checkApiStatus]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveApiUrl(inputUrl);
      await saveBearerToken(inputToken);

      // Sauvegarder les temps avec valeurs par défaut si vides
      const openTime = inputOpeningTime ? parseInt(inputOpeningTime, 10) : 15;
      const closeTime = inputClosingTime ? parseInt(inputClosingTime, 10) : 15;

      await saveOpeningTime(openTime);
      await saveClosingTime(closeTime);

      setApiUrl(inputUrl);
      setBearerTokenState(inputToken);
      setOpeningTime(openTime);
      setClosingTime(closeTime);
      setEditing(false);

      // Vérifier immédiatement le statut après sauvegarde
      await checkApiStatus();
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setInputUrl(apiUrl || '');
    setInputToken(bearerToken || '');
    setInputOpeningTime(openingTime?.toString() || '15');
    setInputClosingTime(closingTime?.toString() || '15');
    setEditing(true);
  };

  const handleTestConnection = async () => {
    if (!inputUrl || !inputToken) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setCheckingStatus(true);
    try {
      // Sauvegarder temporairement pour tester
      await saveApiUrl(inputUrl);
      await saveBearerToken(inputToken);

      const isHealthy = await GateService.isApiHealthy();

      if (isHealthy) {
        Alert.alert('Succès', 'Connexion API réussie !');
      } else {
        Alert.alert('Erreur', 'Impossible de se connecter à l\'API');
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Erreur de connexion';
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!apiUrl || !bearerToken || editing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Configuration API</Text>

        <Text style={styles.label}>URL de l&apos;API</Text>
        <TextInput
          style={styles.input}
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="https://mon-api.com"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Bearer Token</Text>
        <TextInput
          style={styles.input}
          value={inputToken}
          onChangeText={setInputToken}
          placeholder="token..."
          autoCapitalize="none"
          secureTextEntry
        />

        <Text style={styles.label}>Temps d&apos;ouverture (secondes)</Text>
        <TextInput
          style={styles.input}
          value={inputOpeningTime}
          onChangeText={setInputOpeningTime}
          placeholder="15"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Temps de fermeture (secondes)</Text>
        <TextInput
          style={styles.input}
          value={inputClosingTime}
          onChangeText={setInputClosingTime}
          placeholder="15"
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <Button
            label={checkingStatus ? "Test en cours..." : "Tester la connexion"}
            onPress={handleTestConnection}
            disabled={!inputUrl || !inputToken || checkingStatus}
            variant="outline"
            loading={checkingStatus}
            style={styles.testButton}
          />

          <Button
            label="Enregistrer"
            onPress={handleSave}
            disabled={!inputUrl || !inputToken}
            style={styles.saveButton}
          />
        </View>

        {(apiUrl && bearerToken) && (
          <Button
            label="Annuler"
            onPress={() => setEditing(false)}
            variant="secondary"
            style={styles.cancelButton}
          />
        )}
      </View>
    );
  }

  // Afficher un avertissement si l'API n'est pas accessible
  if (!apiStatus.isHealthy && apiStatus.error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Problème de connexion API</Text>
        <Text style={styles.errorText}>{apiStatus.error}</Text>
        <Text style={styles.subText}>
          Vérifiez votre connexion internet et vos paramètres API.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            label={checkingStatus ? "Vérification..." : "Réessayer"}
            onPress={checkApiStatus}
            disabled={checkingStatus}
            loading={checkingStatus}
            style={styles.retryButton}
          />

          <Button
            label="Modifier les paramètres"
            onPress={handleEdit}
            variant="outline"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      <View style={styles.editButton}>
        <Button
          label="Paramètres"
          onPress={handleEdit}
          variant={"outline"}
          size={"small"}
        />
        {checkingStatus && (
          <ActivityIndicator size="small" style={styles.statusIndicator} />
        )}

      </View>
      <View style={[styles.statusDot, { backgroundColor: apiStatus.isHealthy ? '#4CAF50' : '#F44336' }]} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
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
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  testButton: {
    marginBottom: 8,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginTop: 16,
  },
  retryButton: {
    marginBottom: 12,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  subText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    marginLeft: 8,
  },
  statusDot: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
