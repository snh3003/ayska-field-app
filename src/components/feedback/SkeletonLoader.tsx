import React, { useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { View as TamaguiView } from '@tamagui/core';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { SkeletonProps } from '../../types';

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonProps) {
  const colorScheme = useColorScheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-300, 300]);

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <TamaguiView
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#E0E0E0'}
      overflow="hidden"
      style={style}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colorScheme === 'dark' ? '#3A3A3A' : '#F0F0F0',
            opacity: 0.5,
          },
          animatedStyle,
        ]}
      />
    </TamaguiView>
  );
}

// Pre-built skeleton layouts
export function CardSkeleton() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <TamaguiView
      backgroundColor={theme.card}
      borderRadius={BorderRadius.md}
      padding="$md"
      marginBottom="$md"
    >
      <TamaguiView flexDirection="row" alignItems="center">
        <Skeleton width={48} height={48} borderRadius={BorderRadius.md} />
        <TamaguiView flex={1} marginLeft="$md">
          <TamaguiView marginBottom="$sm">
            <Skeleton width="70%" height={16} />
          </TamaguiView>
          <Skeleton width="50%" height={12} />
        </TamaguiView>
      </TamaguiView>
    </TamaguiView>
  );
}

export function StatCardSkeleton() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <TamaguiView
      backgroundColor={theme.card}
      borderRadius={BorderRadius.md}
      padding="$md"
      flex={1}
      marginHorizontal={Spacing.xs / 2}
    >
      <TamaguiView marginBottom="$sm">
        <Skeleton width={40} height={40} borderRadius={BorderRadius.sm} />
      </TamaguiView>
      <TamaguiView marginBottom="$xs">
        <Skeleton width="60%" height={12} />
      </TamaguiView>
      <Skeleton width="80%" height={24} />
    </TamaguiView>
  );
}

export function ListItemSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}
