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
  const theme = Colors[colorScheme ?? 'light'];
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
      backgroundColor="$card"
      opacity={0.3}
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
            backgroundColor: theme.textSecondary,
            opacity: 0.2,
          },
          animatedStyle,
        ]}
      />
    </TamaguiView>
  );
}

// Pre-built skeleton layouts
export interface CardSkeletonProps {
  variant?: 'default' | 'doctor' | 'notification' | 'assignment';
}

export function CardSkeleton({ variant = 'default' }: CardSkeletonProps = {}) {
  if (variant === 'doctor') {
    return (
      <TamaguiView
        backgroundColor="$card"
        borderRadius={BorderRadius.md}
        padding="$md"
        marginBottom="$md"
      >
        <TamaguiView marginBottom="$sm">
          <Skeleton width="70%" height={20} />
        </TamaguiView>
        <TamaguiView marginBottom="$xs">
          <Skeleton width="50%" height={16} />
        </TamaguiView>
        <TamaguiView marginBottom="$xs">
          <Skeleton width="80%" height={14} />
        </TamaguiView>
        <Skeleton width="90%" height={14} />
      </TamaguiView>
    );
  }

  if (variant === 'notification') {
    return (
      <TamaguiView
        backgroundColor="$card"
        borderRadius={BorderRadius.md}
        padding="$md"
        marginBottom="$md"
      >
        <TamaguiView flexDirection="row" justifyContent="space-between" alignItems="flex-start">
          <TamaguiView flex={1} marginRight="$sm">
            <TamaguiView marginBottom="$xs">
              <Skeleton width="75%" height={18} />
            </TamaguiView>
            <TamaguiView marginBottom="$xs">
              <Skeleton width="100%" height={14} />
            </TamaguiView>
            <TamaguiView marginBottom="$xs">
              <Skeleton width="85%" height={14} />
            </TamaguiView>
            <TamaguiView flexDirection="row" justifyContent="space-between" alignItems="center">
              <Skeleton width="30%" height={12} />
              <Skeleton width={8} height={8} borderRadius={4} />
            </TamaguiView>
          </TamaguiView>
        </TamaguiView>
      </TamaguiView>
    );
  }

  if (variant === 'assignment') {
    return (
      <TamaguiView
        backgroundColor="$card"
        borderRadius={BorderRadius.md}
        padding="$md"
        marginBottom="$md"
      >
        {/* Header with title and status badge */}
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$sm"
        >
          <TamaguiView flex={1} marginRight="$sm">
            <TamaguiView marginBottom="$xs">
              <Skeleton width="60%" height={18} />
            </TamaguiView>
            <Skeleton width="40%" height={12} />
          </TamaguiView>
          <Skeleton width={60} height={24} borderRadius={BorderRadius.sm} />
        </TamaguiView>

        {/* Progress section */}
        <TamaguiView marginBottom="$sm">
          <TamaguiView flexDirection="row" justifyContent="space-between" marginBottom="$xs">
            <Skeleton width="40%" height={14} />
            <Skeleton width="15%" height={14} />
          </TamaguiView>
          <Skeleton width="100%" height={8} borderRadius={BorderRadius.sm} />
        </TamaguiView>

        {/* Footer with target */}
        <TamaguiView flexDirection="row" alignItems="center">
          <Skeleton width={16} height={16} borderRadius={8} />
          <TamaguiView marginLeft="$xs">
            <Skeleton width="50%" height={12} />
          </TamaguiView>
        </TamaguiView>
      </TamaguiView>
    );
  }

  // Default variant
  return (
    <TamaguiView
      backgroundColor="$card"
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
  return (
    <TamaguiView
      backgroundColor="$card"
      borderRadius={BorderRadius.md}
      padding="$md"
      flex={1}
      marginHorizontal={Spacing.xs / 2}
      minHeight={100}
      justifyContent="center"
      alignItems="center"
    >
      <TamaguiView marginBottom="$xs" alignItems="center">
        <Skeleton width="60%" height={28} />
      </TamaguiView>
      <TamaguiView marginBottom="$xs" alignItems="center">
        <Skeleton width="70%" height={14} />
      </TamaguiView>
      <TamaguiView alignItems="center">
        <Skeleton width="50%" height={12} />
      </TamaguiView>
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

// Form skeleton component
export interface FormSkeletonProps {
  fieldCount?: number;
  showCard?: boolean;
}

export function FormSkeleton({ fieldCount = 6, showCard = true }: FormSkeletonProps = {}) {
  const content = (
    <TamaguiView>
      {[...Array(fieldCount)].map((_, i) => (
        <TamaguiView key={i} marginBottom="$md">
          <TamaguiView marginBottom="$xs">
            <Skeleton width="30%" height={14} />
          </TamaguiView>
          <Skeleton width="100%" height={44} borderRadius={BorderRadius.sm} />
        </TamaguiView>
      ))}
    </TamaguiView>
  );

  if (showCard) {
    return (
      <TamaguiView
        backgroundColor="$card"
        borderRadius={BorderRadius.md}
        padding="$md"
        marginBottom="$md"
      >
        {content}
      </TamaguiView>
    );
  }

  return content;
}
