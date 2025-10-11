import { type ViewProps } from 'react-native';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { View as TamaguiView } from '@tamagui/core';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

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
