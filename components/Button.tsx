import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

export interface ButtonProps {
  /** Texte affiché sur le bouton */
  label: string;
  /** Fonction appelée lors du clic */
  onPress: () => void;
  /** Variante du bouton */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Taille du bouton */
  size?: 'small' | 'medium' | 'large';
  /** Désactiver le bouton */
  disabled?: boolean;
  /** Afficher un indicateur de chargement */
  loading?: boolean;
  /** Style personnalisé pour le conteneur */
  style?: ViewStyle;
  /** Style personnalisé pour le texte */
  textStyle?: TextStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#007AFF' : '#FFFFFF'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            isDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variantes
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#8E8E93',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },

  // Tailles
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },

  // État désactivé
  disabled: {
    opacity: 0.5,
  },

  // Styles de texte
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Texte par variante
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#007AFF',
  },

  // Texte par taille
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Texte désactivé
  disabledText: {
    opacity: 0.7,
  },
});
