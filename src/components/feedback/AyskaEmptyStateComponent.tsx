import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
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
      <AyskaTitleComponent
        level={2}
        weight="semibold"
        color="text"
        align="center"
        style={{ marginBottom: 16 }}
      >
        {title}
      </AyskaTitleComponent>
      <AyskaTextComponent
        variant="bodyLarge"
        color="textSecondary"
        align="center"
        style={{ marginBottom: 24, maxWidth: 280 }}
      >
        {message}
      </AyskaTextComponent>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: theme.primary,
          }}
          onPress={onAction}
        >
          <AyskaTextComponent
            variant="bodyLarge"
            weight="semibold"
            color="text"
            style={{ color: 'white' }}
          >
            {actionLabel}
          </AyskaTextComponent>
        </TouchableOpacity>
      )}
    </TamaguiView>
  );
}
