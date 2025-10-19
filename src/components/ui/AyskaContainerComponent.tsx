import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaContainerProps } from '../../types';

export const AyskaContainerComponent: React.FC<AyskaContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  margin = 'none',
  center = true,
  backgroundColor = 'transparent',
  borderRadius = 'none',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Max width mapping
  const maxWidthMap = {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
    full: '100%',
  };

  // Padding mapping
  const paddingMap = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  // Margin mapping
  const marginMap = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  // Background color mapping
  const backgroundColorMap = {
    transparent: 'transparent',
    card: theme.card,
    background: theme.background,
    primaryBg: theme.primaryBg,
    secondaryBg: theme.secondaryBg,
  };

  // Border radius mapping
  const borderRadiusMap = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  };

  // Build styles
  const containerStyles = {
    width: '100%',
    maxWidth: maxWidthMap[maxWidth],
    padding: paddingMap[padding],
    margin: center ? '0 auto' : marginMap[margin],
    backgroundColor: backgroundColorMap[backgroundColor],
    borderRadius: borderRadiusMap[borderRadius],
    ...style,
  };

  return (
    <TamaguiView style={containerStyles} {...getA11yProps(accessibilityLabel)}>
      {children}
    </TamaguiView>
  );
};
