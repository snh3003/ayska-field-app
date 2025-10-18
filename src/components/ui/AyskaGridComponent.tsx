import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaGridProps } from '../../types';

export const AyskaGridComponent: React.FC<AyskaGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  autoFit = false,
  autoFill = false,
  padding = 'none',
  margin = 'none',
  backgroundColor = 'transparent',
  borderRadius = 'none',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Gap mapping
  const gapMap = {
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

  // Calculate grid template columns
  let gridTemplateColumns: string;

  if (autoFit) {
    // Auto-fit: fit as many columns as possible with min 200px width
    gridTemplateColumns = `repeat(auto-fit, minmax(200px, 1fr))`;
  } else if (autoFill) {
    // Auto-fill: fill available space with columns of 200px width
    gridTemplateColumns = `repeat(auto-fill, minmax(200px, 1fr))`;
  } else {
    // Fixed columns
    gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }

  // Build styles
  const gridStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapMap[gap],
    padding: paddingMap[padding],
    margin: marginMap[margin],
    backgroundColor: backgroundColorMap[backgroundColor],
    borderRadius: borderRadiusMap[borderRadius],
    // For web, use CSS Grid
    ...(typeof window !== 'undefined' && {
      display: 'grid',
      gridTemplateColumns,
    }),
    ...style,
  };

  // For React Native, we'll use flexbox with calculated widths
  const itemWidth = autoFit || autoFill ? 'auto' : `${100 / columns}%`;

  return (
    <TamaguiView style={gridStyles} {...getA11yProps(accessibilityLabel)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            style: {
              ...(child.props as any)?.style,
              width: itemWidth,
              minWidth: autoFit || autoFill ? 200 : undefined,
            },
          } as any);
        }
        return child;
      })}
    </TamaguiView>
  );
};
