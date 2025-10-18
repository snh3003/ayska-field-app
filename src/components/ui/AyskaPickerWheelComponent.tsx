import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaTextComponent } from './AyskaTextComponent';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';

interface PickerWheelProps {
  items: (string | number)[];
  selectedIndex: number;
  onValueChange: (_index: number) => void;
  itemHeight?: number;
  containerHeight?: number;
}

export const PickerWheel: React.FC<PickerWheelProps> = ({
  items,
  selectedIndex,
  onValueChange,
  itemHeight = 44,
  containerHeight = 220,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Calculate padding to center items
  const paddingTop = (containerHeight - itemHeight) / 2;
  const paddingBottom = (containerHeight - itemHeight) / 2;

  // Calculate initial scroll position
  const initialScrollY = selectedIndex * itemHeight;

  useEffect(() => {
    // Scroll to selected item when component mounts or selectedIndex changes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: initialScrollY,
        animated: false,
      });
    }
  }, [selectedIndex, itemHeight, initialScrollY]);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(currentScrollY / itemHeight);

    // Ensure index is within bounds
    const clampedIndex = Math.max(0, Math.min(newIndex, items.length - 1));

    if (clampedIndex !== selectedIndex) {
      onValueChange(clampedIndex);
    }
  };

  const getItemOpacity = (index: number) => {
    const centerIndex = Math.round(scrollY / itemHeight);
    const distance = Math.abs(index - centerIndex);

    if (distance === 0) return 1; // Center item
    if (distance === 1) return 0.6; // Adjacent items
    if (distance === 2) return 0.4; // Near items
    return 0.2; // Far items
  };

  const getItemColor = (index: number) => {
    const centerIndex = Math.round(scrollY / itemHeight);
    const distance = Math.abs(index - centerIndex);

    if (distance === 0) return theme.primary; // Center item
    return theme.textSecondary; // Other items
  };

  const getItemFontWeight = (index: number) => {
    const centerIndex = Math.round(scrollY / itemHeight);
    const distance = Math.abs(index - centerIndex);

    return distance === 0 ? '600' : '400';
  };

  return (
    <TamaguiView
      height={containerHeight}
      position="relative"
      backgroundColor={theme.card}
    >
      {/* Selection indicator overlay */}
      <TamaguiView
        position="absolute"
        top={paddingTop}
        left={0}
        right={0}
        height={itemHeight}
        borderTopWidth={1}
        borderBottomWidth={1}
        borderColor={theme.primary}
        backgroundColor={theme.primary}
        opacity={0.1}
        zIndex={1}
        pointerEvents="none"
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop,
          paddingBottom,
        }}
        style={{
          flex: 1,
        }}
      >
        {items.map((item, index) => (
          <TamaguiView
            key={index}
            height={itemHeight}
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={16}
          >
            <AyskaTextComponent
              variant="bodyLarge"
              color={
                getItemColor(index) === theme.primary
                  ? 'primary'
                  : 'textSecondary'
              }
              weight={
                getItemFontWeight(index) === '600' ? 'semibold' : 'normal'
              }
              align="center"
              style={{ opacity: getItemOpacity(index) }}
            >
              {item}
            </AyskaTextComponent>
          </TamaguiView>
        ))}
      </ScrollView>

      {/* Fade overlays at top and bottom */}
      <TamaguiView
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={paddingTop}
        backgroundColor={theme.card}
        opacity={0.8}
        pointerEvents="none"
        zIndex={2}
      />
      <TamaguiView
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height={paddingBottom}
        backgroundColor={theme.card}
        opacity={0.8}
        pointerEvents="none"
        zIndex={2}
      />
    </TamaguiView>
  );
};
