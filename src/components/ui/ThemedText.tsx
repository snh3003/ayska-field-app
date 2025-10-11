// KEEP existing imports for backward compatibility
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors, Typography } from '@/constants/theme';
// ADD Tamagui import alongside existing ones
import { Text as TamaguiText } from '@tamagui/core'

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme() ?? 'light';
  const color = theme === 'light' ? lightColor : darkColor;

  // KEEP existing logic for backward compatibility
  const getTamaguiProps = () => {
    switch (type) {
      case 'title': return { fontSize: '$8', fontWeight: '700', lineHeight: '$10' }
      case 'subtitle': return { fontSize: '$6', fontWeight: '600', lineHeight: '$8' }
      case 'defaultSemiBold': return { fontSize: '$4', fontWeight: '600', lineHeight: '$6' }
      case 'link': return { fontSize: '$4', color: '$primary', lineHeight: '$6' }
      default: return { fontSize: '$4', lineHeight: '$6' }
    }
  }

  // GRADUALLY migrate - start with Tamagui, fallback to existing
  return (
    <TamaguiText
      color={color ?? Colors[theme].text}
      {...getTamaguiProps()}
      style={[
        // KEEP existing style logic as fallback
        type === 'default' ? Typography.body : undefined,
        type === 'title' ? Typography.h1 : undefined,
        type === 'defaultSemiBold' ? [Typography.body, { fontWeight: '600' }] : undefined,
        type === 'subtitle' ? Typography.h3 : undefined,
        type === 'link' ? [Typography.body, { color: Colors[theme].primary }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
