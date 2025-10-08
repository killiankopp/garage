import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ButtonProps {
  /** Texte affiché sur le bouton */
  label?: string;
  /** Nom de l'icône Ionicons */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** Taille de l'icône */
  iconSize?: number;
  /** Couleur de l'icône (optionnel, par défaut selon la variante) */
  iconColor?: string;
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
  iconName,
  iconSize,
  iconColor,
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

  // Déterminer la couleur de l'icône selon la variante si pas spécifiée
  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (isDisabled) return variant === 'outline' ? '#8E8E93' : '#FFFFFF';
    return variant === 'outline' ? '#007AFF' : '#FFFFFF';
  };

  // Déterminer la taille de l'icône selon la taille du bouton si pas spécifiée
  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#007AFF' : '#FFFFFF'}
        />
      );
    }

    const hasIcon = iconName;
    const hasLabel = label;

    if (!hasIcon && !hasLabel) {
      return null;
    }

    return (
      <View style={styles.contentContainer}>
        {hasIcon && (
          <Ionicons
            name={iconName}
            size={getIconSize()}
            color={getIconColor()}
            style={hasLabel ? styles.iconWithLabel : undefined}
          />
        )}
        {hasLabel && (
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
      </View>
    );
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
      {renderContent()}
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

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWithLabel: {
    marginRight: 8,
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
