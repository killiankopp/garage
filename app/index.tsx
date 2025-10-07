import { Text, Alert, ScrollView } from "react-native";
import { Button } from "../components";

export default function Index() {
  const handlePrimaryAction = () => {
    Alert.alert("Action", "Bouton principal cliqué !");
  };

  const handleOutlineAction = () => {
    Alert.alert("Action", "Bouton outline cliqué !");
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
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
        Exemples de Boutons
      </Text>

      {/* Bouton principal */}
      <Button
        label="Bouton Principal"
        onPress={handlePrimaryAction}
        variant="primary"
        size="medium"
        style={{ marginBottom: 15 }}
      />

      {/* Bouton outline */}
      <Button
        label="Bouton Outline"
        onPress={handleOutlineAction}
        variant="outline"
        size="small"
        style={{ marginBottom: 15 }}
      />
    </ScrollView>
  );
}
