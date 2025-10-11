import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styled, View as TamaguiView } from '@tamagui/core';
import { CardProps } from '../../types';

const CardContainer = styled(TamaguiView, {
  backgroundColor: '$card',
  borderRadius: '$md',
  padding: '$md',
  marginBottom: '$md',
  variants: {
    variant: {
      elevated: {
        shadowColor: '$shadow',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
      },
      outlined: {
        borderWidth: 1,
        borderColor: '$border',
        shadowOpacity: 0,
        elevation: 0,
      },
      default: {
        shadowColor: '$shadow',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    },
  },
});

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
}) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContainer variant={variant} style={style}>
          {children}
        </CardContainer>
      </TouchableOpacity>
    );
  }
  return (
    <CardContainer variant={variant} style={style}>
      {children}
    </CardContainer>
  );
};
