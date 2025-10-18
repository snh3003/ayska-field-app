import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { hapticFeedback } from '../../../utils/haptics';
import { View as TamaguiView } from '@tamagui/core';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ThemeToggle() {
  const { colorScheme, toggleTheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Smooth rotation when theme changes
    rotate.value = withSpring(isDark ? 360 : 0, {
      damping: 20,
      stiffness: 90,
    });
  }, [isDark, rotate]);

  const handlePress = () => {
    // Quick bounce animation
    scale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );

    hapticFeedback.light();
    toggleTheme();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
        },
        animatedStyle,
      ]}
      activeOpacity={0.8}
    >
      <Animated.View style={iconAnimatedStyle}>
        <TamaguiView
          width={44}
          height={44}
          borderRadius="$full"
          justifyContent="center"
          alignItems="center"
          borderWidth={1}
          backgroundColor="$card"
          borderColor="$border"
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={theme.warning}
          />
        </TamaguiView>
      </Animated.View>
    </AnimatedTouchable>
  );
}
