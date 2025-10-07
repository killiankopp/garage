import { Text, Alert, ScrollView, ActivityIndicator, View } from "react-native";
import { Button } from "../components";
import { GateService, ApiError } from "@/services";
import { useEffect, useState } from "react";

export default function Index() {
  const [apiStatus, setApiStatus] = useState<string>('Vérification en cours...');
  const [loading, setLoading] = useState(true);
  const [statusColor, setStatusColor] = useState('#666');
  const [operationInProgress, setOperationInProgress] = useState(false);

  useEffect(() => {
    checkApiStatus();
  }, []);

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
      Alert.alert(
        "Ouverture en cours",
        `Porte en cours d'ouverture.\nTemps restant: ${Math.round(operation.timeout_remaining / 1000)}s`,
        [{ text: "OK", onPress: () => checkApiStatus() }]
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
      Alert.alert(
        "Fermeture en cours",
        `Porte en cours de fermeture.\nTemps restant: ${Math.round(operation.timeout_remaining / 1000)}s`,
        [{ text: "OK", onPress: () => checkApiStatus() }]
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
        {!loading && (
          <Button
            label="Rafraîchir"
            onPress={checkApiStatus}
            variant="outline"
            size="small"
            style={{ marginTop: 10 }}
          />
        )}
      </View>

      <View style={{ alignItems: 'center', marginBottom: 30 }}>
          {/* Bouton Ouvrir - Rouge */}
          <Button
            label={operationInProgress ? "Commande en cours..." : "Ouvrir"}
            onPress={handleOpenGate}
            variant="primary"
            size="large"
            disabled={operationInProgress}
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
            disabled={operationInProgress}
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
