import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}

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
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.overlay,
              { backgroundColor: theme.overlay },
              overlayStyle,
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
              height,
            },
            sheetStyle,
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
            {title && (
              <View style={styles.titleContainer}>
                <Text style={[Typography.h4, { color: theme.text }]}>
                  {title}
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    paddingTop: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
});
