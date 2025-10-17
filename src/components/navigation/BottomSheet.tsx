import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { BorderRadius, Colors } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { BottomSheetProps } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function BottomSheet({
  isVisible,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.6,
}: BottomSheetProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 200,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(height, {
        damping: 25,
        stiffness: 200,
      });
    }
  }, [isVisible, height, opacity, translateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TamaguiView flex={1} justifyContent="flex-end">
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.overlay,
              },
              overlayStyle,
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            {
              borderTopLeftRadius: BorderRadius.xl,
              borderTopRightRadius: BorderRadius.xl,
              overflow: 'hidden',
              backgroundColor: theme.background,
              height,
            },
            sheetStyle,
          ]}
        >
          <TamaguiView paddingTop="$sm">
            <TamaguiView
              width={40}
              height={4}
              borderRadius={2}
              alignSelf="center"
              marginBottom="$md"
              backgroundColor={theme.border}
            />
            {title && (
              <TamaguiView
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal="$lg"
                paddingBottom="$md"
              >
                <TamaguiText fontSize="$6" fontWeight="600" color={theme.text}>
                  {title}
                </TamaguiText>
                <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </TamaguiView>
            )}
          </TamaguiView>
          <TamaguiView flex={1} paddingHorizontal="$lg">
            {children}
          </TamaguiView>
        </Animated.View>
      </TamaguiView>
    </Modal>
  );
}
