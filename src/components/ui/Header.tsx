import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    title: string;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  return (
    <TamaguiView
      backgroundColor="$card"
      paddingHorizontal="$lg"
      paddingVertical="$md"
      borderBottomWidth={1}
      borderBottomColor="$border"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <TamaguiView flex={1}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 4 }}>
            <TamaguiText color="$primary" fontSize="$4" fontWeight="600">
              ← Back
            </TamaguiText>
          </TouchableOpacity>
        )}
        <TamaguiText fontSize="$6" fontWeight="700" color="$text">
          {title}
        </TamaguiText>
        {subtitle && (
          <TamaguiText
            fontSize="$3"
            color="$text"
            opacity={0.7}
            marginTop="$xs"
          >
            {subtitle}
          </TamaguiText>
        )}
      </TamaguiView>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <TamaguiText color="$primary" fontSize="$4" fontWeight="600">
            {rightAction.title}
          </TamaguiText>
        </TouchableOpacity>
      )}
    </TamaguiView>
  );
};
