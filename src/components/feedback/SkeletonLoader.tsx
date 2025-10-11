import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

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
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#E0E0E0',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colorScheme === 'dark' ? '#3A3A3A' : '#F0F0F0',
            opacity: 0.5,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

// Pre-built skeleton layouts
export function CardSkeleton() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton width={48} height={48} borderRadius={BorderRadius.md} />
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Skeleton
            width="70%"
            height={16}
            style={{ marginBottom: Spacing.sm }}
          />
          <Skeleton width="50%" height={12} />
        </View>
      </View>
    </View>
  );
}

export function StatCardSkeleton() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        flex: 1,
        marginHorizontal: Spacing.xs / 2,
      }}
    >
      <Skeleton
        width={40}
        height={40}
        borderRadius={BorderRadius.sm}
        style={{ marginBottom: Spacing.sm }}
      />
      <Skeleton width="60%" height={12} style={{ marginBottom: Spacing.xs }} />
      <Skeleton width="80%" height={24} />
    </View>
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
