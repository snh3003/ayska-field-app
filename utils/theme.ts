import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';

/**
 * Custom hook that provides theme-aware colors based on the current color scheme
 * @returns Theme colors object for the current color scheme (light/dark)
 */
export const useTheme = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme];
};
