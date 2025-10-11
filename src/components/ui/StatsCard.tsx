import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { StatsCardProps } from '../../types';

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color = 'primary',
  icon,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const getColor = () => {
    switch (color) {
      case 'secondary':
        return theme.secondary;
      case 'success':
        return theme.success;
      case 'warning':
        return theme.warning;
      case 'info':
        return theme.info;
      default:
        return theme.primary;
    }
  };

  const accentColor = getColor();

  return (
    <TamaguiView
      backgroundColor="$card"
      borderColor="$border"
      borderRadius="$md"
      padding="$md"
      marginBottom="$md"
      flex={1}
      marginHorizontal="$xs"
      borderWidth={0}
      shadowColor="$shadow"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={4}
    >
      {/* Top row: Icon and Title */}
      <TamaguiView
        flexDirection="row"
        alignItems="center"
        justifyContent="space-evenly"
        marginBottom="$sm"
        gap="$sm"
      >
        {icon && (
          <TamaguiView
            width={40}
            height={40}
            borderRadius="$sm"
            justifyContent="center"
            alignItems="center"
            backgroundColor={accentColor + '15'}
          >
            {icon}
          </TamaguiView>
        )}
        <TamaguiText fontSize="$3" color="$textSecondary" flex={1}>
          {title}
        </TamaguiText>
      </TamaguiView>

      {/* Value row */}
      <TamaguiView
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <TamaguiText
          fontSize="$8"
          fontWeight="700"
          color={accentColor}
          marginBottom={subtitle ? '$xs' : 0}
        >
          {value}
        </TamaguiText>
      </TamaguiView>

      {subtitle && (
        <TamaguiText fontSize="$2" color="$textSecondary">
          {subtitle}
        </TamaguiText>
      )}
    </TamaguiView>
  );
};
