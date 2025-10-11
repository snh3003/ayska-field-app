import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { View as TamaguiView, Text as TamaguiText } from '@tamagui/core'

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    label: string;
  };
}

const SWIPE_THRESHOLD = 120;

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
}: SwipeableCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const translateX = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationX > 0 && rightAction) {
        translateX.value = event.translationX;
      } else if (event.translationX < 0 && leftAction) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD && onSwipeRight) {
        runOnJS(onSwipeRight)();
      } else if (event.translationX < -SWIPE_THRESHOLD && onSwipeLeft) {
        runOnJS(onSwipeLeft)();
      }
      translateX.value = withSpring(0);
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rLeftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -SWIPE_THRESHOLD ? 1 : 0.5,
  }));

  const rRightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > SWIPE_THRESHOLD ? 1 : 0.5,
  }));

  return (
    <TamaguiView position="relative">
      {rightAction && (
        <Animated.View
          style={[
            styles.actionContainer,
            styles.rightAction,
            { backgroundColor: rightAction.color },
            rRightActionStyle,
          ]}
        >
          <Ionicons name={rightAction.icon} size={24} color="#FFF" />
          <TamaguiText 
            color="white"
            fontWeight="600"
            marginTop="$xs"
            fontSize="$2"
          >
            {rightAction.label}
          </TamaguiText>
        </Animated.View>
      )}
      {leftAction && (
        <Animated.View
          style={[
            styles.actionContainer,
            styles.leftAction,
            { backgroundColor: leftAction.color },
            rLeftActionStyle,
          ]}
        >
          <Ionicons name={leftAction.icon} size={24} color="#FFF" />
          <TamaguiText 
            color="white"
            fontWeight="600"
            marginTop="$xs"
            fontSize="$2"
          >
            {leftAction.label}
          </TamaguiText>
        </Animated.View>
      )}
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={rStyle}>{children}</Animated.View>
      </PanGestureHandler>
    </TamaguiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  rightAction: {
    left: 0,
    right: 0,
  },
  leftAction: {
    left: 0,
    right: 0,
  },
  actionText: {
    color: '#FFF',
    fontWeight: '600',
    marginTop: Spacing.xs,
    fontSize: 12,
  },
});

