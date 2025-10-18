import React from 'react';
import { Dimensions, Image, Platform } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'responsive';
  style?: any;
  matchCardWidth?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive sizing based on screen dimensions and platform
const getResponsiveSizes = () => {
  const isTablet = SCREEN_WIDTH >= 768;
  const isSmallScreen = SCREEN_WIDTH < 375;
  const isLargeScreen = SCREEN_WIDTH > 414;

  // Base sizes for different screen types
  const baseSizes = {
    small: { width: 80, height: 32 },
    medium: { width: 120, height: 48 },
    large: { width: 160, height: 64 },
  };

  // Scale factors based on screen size and platform
  const scaleFactor = isTablet
    ? 1.5
    : isSmallScreen
      ? 0.8
      : isLargeScreen
        ? 1.2
        : 1;
  const platformScale = Platform.OS === 'ios' ? 1.1 : 1;

  return {
    small: {
      width: baseSizes.small.width * scaleFactor * platformScale,
      height: baseSizes.small.height * scaleFactor * platformScale,
    },
    medium: {
      width: baseSizes.medium.width * scaleFactor * platformScale,
      height: baseSizes.medium.height * scaleFactor * platformScale,
    },
    large: {
      width: baseSizes.large.width * scaleFactor * platformScale,
      height: baseSizes.large.height * scaleFactor * platformScale,
    },
  };
};

export function Logo({
  size = 'large',
  style,
  matchCardWidth = false,
}: LogoProps) {
  const responsiveSizes = getResponsiveSizes();

  let dimensions;
  if (size === 'responsive') {
    // For responsive size, use a percentage of screen width
    const cardWidth = SCREEN_WIDTH * 1.1; // 85% of screen width for card-like appearance
    const aspectRatio = 2.5; // Logo aspect ratio
    dimensions = {
      width: matchCardWidth ? cardWidth : Math.min(cardWidth, 280),
      height:
        (matchCardWidth ? cardWidth : Math.min(cardWidth, 280)) / aspectRatio,
    };
  } else {
    dimensions = responsiveSizes[size];
  }

  return (
    <TamaguiView alignItems="center" justifyContent="center" style={style}>
      <Image
        source={require('../../../assets/images/Ayska.png')}
        style={dimensions}
        resizeMode="contain"
      />
    </TamaguiView>
  );
}
