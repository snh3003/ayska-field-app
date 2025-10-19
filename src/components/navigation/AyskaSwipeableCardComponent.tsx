import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { SwipeableCardProps } from '../../types';

const SWIPE_THRESHOLD = 120;

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);

  const panGestureEvent = (event: any) => {
    if (event.translationX > 0 && rightAction) {
      translateX.value = event.translationX;
    } else if (event.translationX < 0 && leftAction) {
      translateX.value = event.translationX;
    }
  };

  const panGestureEnd = (event: any) => {
    if (event.translationX > SWIPE_THRESHOLD && onSwipeRight) {
      runOnJS(onSwipeRight)();
    } else if (event.translationX < -SWIPE_THRESHOLD && onSwipeLeft) {
      runOnJS(onSwipeLeft)();
    }
    translateX.value = withSpring(0);
  };

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
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 32,
              borderRadius: 12,
              backgroundColor: rightAction.color,
            },
            rRightActionStyle,
          ]}
        >
          <Ionicons name={rightAction.icon} size={24} color="#FFF" />
          <AyskaCaptionComponent
            color="textSecondary"
            style={{ color: 'white', fontWeight: '600', marginTop: 4 }}
          >
            {rightAction.label}
          </AyskaCaptionComponent>
        </Animated.View>
      )}
      {leftAction && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 32,
              borderRadius: 12,
              backgroundColor: leftAction.color,
            },
            rLeftActionStyle,
          ]}
        >
          <Ionicons name={leftAction.icon} size={24} color="#FFF" />
          <AyskaCaptionComponent
            color="textSecondary"
            style={{ color: 'white', fontWeight: '600', marginTop: 4 }}
          >
            {leftAction.label}
          </AyskaCaptionComponent>
        </Animated.View>
      )}
      <PanGestureHandler
        onGestureEvent={panGestureEvent}
        onEnded={panGestureEnd}
      >
        <Animated.View style={rStyle}>{children}</Animated.View>
      </PanGestureHandler>
    </TamaguiView>
  );
}
