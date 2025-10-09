import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.primary + '15' },
        ]}
      >
        <Ionicons name={icon} size={64} color={theme.primary} />
      </View>
      <Text style={[Typography.h3, styles.title, { color: theme.text }]}>
        {title}
      </Text>
      <Text
        style={[
          Typography.body,
          styles.message,
          { color: theme.textSecondary },
        ]}
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={onAction}
        >
          <Text style={[Typography.button, styles.buttonText]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 280,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

