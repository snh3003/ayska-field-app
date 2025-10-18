import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AyskaTitleComponent } from './AyskaTitleComponent';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { useTheme } from '../../../utils/theme';

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
  const theme = useTheme();

  return (
    <AyskaStackComponent
      direction="horizontal"
      align="center"
      justify="space-between"
      padding="lg"
      backgroundColor="card"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <AyskaStackComponent direction="vertical" style={{ flex: 1 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 4 }}>
            <AyskaTextComponent color="primary" weight="semibold">
              ← Back
            </AyskaTextComponent>
          </TouchableOpacity>
        )}
        <AyskaTitleComponent level={3} weight="bold" color="text">
          {title}
        </AyskaTitleComponent>
        {subtitle && (
          <AyskaCaptionComponent color="textSecondary" style={{ marginTop: 4 }}>
            {subtitle}
          </AyskaCaptionComponent>
        )}
      </AyskaStackComponent>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <AyskaTextComponent color="primary" weight="semibold">
            {rightAction.title}
          </AyskaTextComponent>
        </TouchableOpacity>
      )}
    </AyskaStackComponent>
  );
};
