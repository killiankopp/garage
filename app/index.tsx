import { Text, Alert, ScrollView, ActivityIndicator, View } from "react-native";
import { Button } from "../components";
import { GateService, ApiError } from "@/services";
import { getOpeningTime, getClosingTime } from "@/utils/apiCredentials";
import { useEffect, useState, useRef } from "react";

export default function Index() {
  const [apiStatus, setApiStatus] = useState<string>('Vérification en cours...');
  const [loading, setLoading] = useState(true);
  const [statusColor, setStatusColor] = useState('#666');
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [openingTime, setOpeningTime] = useState<number>(15);
  const [closingTime, setClosingTime] = useState<number>(15);
  const [timerActive, setTimerActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerOperation, setTimerOperation] = useState<'opening' | 'closing' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const openTime = await getOpeningTime();
      const closeTime = await getClosingTime();

      setOpeningTime(openTime || 15);
      setClosingTime(closeTime || 15);
    };

    loadSettings();
    checkApiStatus();
  }, []);

  // Nettoyer le timer au démontage du composant
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = (duration: number, operation: 'opening' | 'closing') => {
    setTimerActive(true);
    setTimerOperation(operation);
    setRemainingTime(duration);

    // Mettre à jour immédiatement le statut
    updateTimerStatus(duration, operation);

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Timer terminé
          setTimerActive(false);
          setTimerOperation(null);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Vérifier le statut final
          checkApiStatus();
          return 0;
        }
        updateTimerStatus(newTime, operation);
        return newTime;
      });
    }, 1000);
  };

  const updateTimerStatus = (timeLeft: number, operation: 'opening' | 'closing') => {
    const operationText = operation === 'opening' ? 'Ouverture' : 'Fermeture';
    setApiStatus(`${operationText} en cours... ${timeLeft}s`);
    setStatusColor('#FF9800'); // Orange pour l'opération en cours
  };

  const checkApiStatus = async () => {
    setLoading(true);
    setApiStatus('Actualisation en cours...');
    setStatusColor('#666');

    try {
      const status = await GateService.getStatus();

      // Traduction des statuts en français avec les nouveaux statuts
      let statusText;
      switch (status.status) {
        case 'open':
          statusText = 'Porte ouverte';
          setStatusColor('#F44336'); // Rouge pour ouvert
          break;
        case 'closed':
          statusText = 'Porte fermée';
          setStatusColor('#4CAF50'); // Vert pour fermé
          break;
        case 'opening':
          statusText = 'Ouverture en cours...';
          setStatusColor('#FF9800'); // Orange pour en mouvement
          break;
        case 'closing':
          statusText = 'Fermeture en cours...';
          setStatusColor('#FF9800'); // Orange pour en mouvement
          break;
        case 'unknown':
          statusText = 'Statut inconnu';
          setStatusColor('#FF9800'); // Orange pour inconnu
          break;
        default:
          statusText = `Statut: ${status.status}`;
          setStatusColor('#666'); // Gris par défaut
      }

      setApiStatus(`${statusText}${status.version ? ` (v${status.version})` : ''}`);
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? `Erreur API: ${error.message}`
        : 'Erreur de connexion inconnue';
      setApiStatus(errorMessage);
      setStatusColor('#F44336');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGate = async () => {
    setOperationInProgress(true);
    try {
      const operation = await GateService.open();

      // Démarrer le timer avec le temps configuré
      startTimer(openingTime, 'opening');

      Alert.alert(
        "Ouverture en cours",
        `Porte en cours d'ouverture.\nTemps configuré: ${openingTime}s\nTemps restant API: ${Math.round(operation.timeout_remaining / 1000)}s`,
        [{ text: "OK" }]
      );
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Erreur lors de l\'ouverture';
      Alert.alert("Erreur", errorMessage);
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleCloseGate = async () => {
    setOperationInProgress(true);
    try {
      const operation = await GateService.close();

      // Démarrer le timer avec le temps configuré
      startTimer(closingTime, 'closing');

      Alert.alert(
        "Fermeture en cours",
        `Porte en cours de fermeture.\nTemps configuré: ${closingTime}s\nTemps restant API: ${Math.round(operation.timeout_remaining / 1000)}s`,
        [{ text: "OK" }]
      );
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Erreur lors de la fermeture';
      Alert.alert("Erreur", errorMessage);
    } finally {
      setOperationInProgress(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 100 }}>
        {loading && <ActivityIndicator size="small" style={{ marginBottom: 10 }} />}
        <Text style={{
          fontSize: 18,
          fontWeight: "600",
          textAlign: 'center',
          color: statusColor
        }}>
          {apiStatus}
        </Text>
        {!loading && !timerActive && (
          <Button
            label="Rafraîchir"
            onPress={checkApiStatus}
            variant="outline"
            size="small"
            style={{ marginTop: 10 }}
          />
        )}
        {timerActive && (
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginTop: 5,
            fontStyle: 'italic'
          }}>
            Actualisation automatique à la fin...
          </Text>
        )}
      </View>

      <View style={{ alignItems: 'center', marginBottom: 30 }}>
          {/* Bouton Ouvrir - Rouge */}
          <Button
            label={operationInProgress ? "Commande en cours..." : "Ouvrir"}
            onPress={handleOpenGate}
            variant="primary"
            size="large"
            disabled={operationInProgress || timerActive}
            loading={operationInProgress}
            style={{
              marginBottom: 20,
              backgroundColor: '#F44336', // Rouge pour ouvrir
              minWidth: 200
            }}
          />

          {/* Bouton Fermer - Vert */}
          <Button
            label={operationInProgress ? "Commande en cours..." : "Fermer"}
            onPress={handleCloseGate}
            variant="primary"
            size="large"
            disabled={operationInProgress || timerActive}
            loading={operationInProgress}
            style={{
              backgroundColor: '#4CAF50', // Vert pour fermer
              minWidth: 200
            }}
          />
      </View>
    </ScrollView>
  );
}
