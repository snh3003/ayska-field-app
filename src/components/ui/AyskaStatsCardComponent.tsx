import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaTitleComponent } from './AyskaTitleComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
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

  const getBackgroundColor = () => {
    switch (color) {
      case 'secondary':
        return theme.secondaryBg;
      case 'success':
        return theme.successBg;
      case 'warning':
        return theme.warningBg;
      case 'info':
        return theme.infoBg;
      default:
        return theme.primaryBg;
    }
  };

  const accentColor = getColor();
  const accentBgColor = getBackgroundColor();

  return (
    <AyskaStackComponent
      direction="vertical"
      spacing="sm"
      padding="md"
      backgroundColor="card"
      borderRadius="md"
      style={{
        marginBottom: 16,
        flex: 1,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Top row: Icon and Title */}
      <AyskaStackComponent
        direction="horizontal"
        align="center"
        justify="space-evenly"
        spacing="sm"
      >
        {icon && (
          <AyskaStackComponent
            direction="horizontal"
            align="center"
            justify="center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 4,
              backgroundColor: accentBgColor,
            }}
          >
            {icon}
          </AyskaStackComponent>
        )}
        <AyskaCaptionComponent color="textSecondary" style={{ flex: 1 }}>
          {title}
        </AyskaCaptionComponent>
      </AyskaStackComponent>

      {/* Value row */}
      <AyskaStackComponent
        direction="horizontal"
        align="center"
        justify="center"
      >
        <AyskaTitleComponent
          level={1}
          weight="bold"
          style={{
            color: accentColor,
            marginBottom: subtitle ? 4 : 0,
          }}
        >
          {value}
        </AyskaTitleComponent>
      </AyskaStackComponent>

      {subtitle && (
        <AyskaCaptionComponent color="textSecondary">
          {subtitle}
        </AyskaCaptionComponent>
      )}
    </AyskaStackComponent>
  );
};
