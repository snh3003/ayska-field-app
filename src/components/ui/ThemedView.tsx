import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { View as TamaguiView } from '@tamagui/core';
import { ThemedViewProps } from '../../types';

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const backgroundColor = theme === 'light' ? lightColor : darkColor;

  return (
    <TamaguiView
      backgroundColor={backgroundColor ?? Colors[theme].background}
      style={style}
      {...(otherProps as any)}
    />
  );
}
