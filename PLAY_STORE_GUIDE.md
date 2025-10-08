# Guide de publication sur Google Play Store

## Étapes de préparation (✅ Complétées)

- [x] Configuration EAS Build (`eas.json`)
- [x] Configuration Android dans `app.json`
- [x] Package ID défini (`com.skit.garage`)
- [x] Icônes adaptatives configurées
- [x] Permissions déclarées

## Étapes restantes à faire

### 1. Créer un compte développeur Google Play
- Inscription sur Google Play Console (frais unique de 25$)
- Vérification d'identité

### 2. Construire l'application
```bash
# Build de production (crée un Android App Bundle)
eas build --platform android --profile production

# Alternative pour test (APK)
eas build --platform android --profile preview
```

### 3. Préparer les assets du Play Store
Vous aurez besoin de :
- **Icône d'application** : 512x512px (✅ Vous l'avez déjà)
- **Screenshots** : Au moins 2 captures d'écran
- **Bannière de fonctionnalité** : 1024x500px (optionnelle)
- **Description de l'app** en français et/ou anglais

### 4. Métadonnées requises
- Titre de l'application (30 caractères max)
- Description courte (80 caractères max)  
- Description complète (4000 caractères max)
- Classification du contenu
- Politique de confidentialité (URL)

### 5. Tests et validation
- Test interne avec EAS Submit
- Test alpha/bêta (recommandé)
- Soumission en production

### 6. Commandes de soumission
```bash
# Upload sur Play Store (nécessite configuration)
eas submit --platform android --profile production
```

## Informations importantes

- **Package ID** : `com.skit.garage` (ne peut plus être changé après publication)
- **Version** : 1.0.0 (versionCode: 1)
- **Build Type** : App Bundle (AAB) - format préféré par Google
- **Permissions** : Internet et Network State (pour votre API de portail)

## Prochaines étapes recommandées

1. Créer votre compte Google Play Console
2. Tester un build avec `eas build --platform android --profile preview`
3. Préparer vos screenshots et descriptions
4. Définir votre politique de confidentialité
