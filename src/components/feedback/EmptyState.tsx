import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <TamaguiView
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$xl"
    >
      <TamaguiView
        width={120}
        height={120}
        borderRadius={60}
        justifyContent="center"
        alignItems="center"
        marginBottom="$lg"
        backgroundColor={theme.primaryBg}
      >
        <Ionicons name={icon} size={64} color={theme.primary} />
      </TamaguiView>
      <TamaguiText
        fontSize="$6"
        fontWeight="600"
        color="$text"
        marginBottom="$md"
        textAlign="center"
      >
        {title}
      </TamaguiText>
      <TamaguiText
        fontSize="$4"
        color="$textSecondary"
        textAlign="center"
        marginBottom="$xl"
        maxWidth={280}
      >
        {message}
      </TamaguiText>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: '$primary',
          }}
          onPress={onAction}
        >
          <TamaguiText fontSize="$4" fontWeight="600" color="white">
            {actionLabel}
          </TamaguiText>
        </TouchableOpacity>
      )}
    </TamaguiView>
  );
}
