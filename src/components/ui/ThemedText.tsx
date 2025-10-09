import { Text, type TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors, Typography } from '@/constants/theme';

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

  return (
    <Text
      style={[
        { color: color ?? Colors[theme].text },
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
