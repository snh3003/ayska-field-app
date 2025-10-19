import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AyskaStackComponent } from './AyskaStackComponent';
import { useTheme } from '../../../utils/theme';
import { CardProps } from '../../types';

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
}) => {
  const theme = useTheme();
  // Variant styling
  const variantStyles = {
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  };

  const cardStyle = {
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...variantStyles[variant],
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <AyskaStackComponent style={cardStyle}>{children}</AyskaStackComponent>
      </TouchableOpacity>
    );
  }
  return (
    <AyskaStackComponent style={cardStyle}>{children}</AyskaStackComponent>
  );
};
