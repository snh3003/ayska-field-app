import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaStackProps } from '../../types';

export const AyskaStackComponent: React.FC<AyskaStackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'start',
  justify = 'start',
  wrap = false,
  padding = 'none',
  margin = 'none',
  backgroundColor = 'transparent',
  borderRadius = 'none',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Spacing mapping
  const spacingMap = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
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

  // Convert direction to flexDirection
  const flexDirection = direction === 'horizontal' ? 'row' : 'column';

  // Convert align to alignItems
  const alignItems =
    align === 'start'
      ? 'flex-start'
      : align === 'center'
        ? 'center'
        : align === 'end'
          ? 'flex-end'
          : 'stretch';

  // Convert justify to justifyContent
  const justifyContent =
    justify === 'start'
      ? 'flex-start'
      : justify === 'center'
        ? 'center'
        : justify === 'end'
          ? 'flex-end'
          : justify === 'space-between'
            ? 'space-between'
            : justify === 'space-around'
              ? 'space-around'
              : justify === 'space-evenly'
                ? 'space-evenly'
                : 'flex-start';

  // Calculate gap based on direction
  const gap = spacingMap[spacing];

  // Build styles
  const stackStyles = {
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap,
    padding: paddingMap[padding],
    margin: marginMap[margin],
    backgroundColor: backgroundColorMap[backgroundColor],
    borderRadius: borderRadiusMap[borderRadius],
    ...style,
  };

  return (
    <TamaguiView style={stackStyles} {...getA11yProps(accessibilityLabel)}>
      {children}
    </TamaguiView>
  );
};
