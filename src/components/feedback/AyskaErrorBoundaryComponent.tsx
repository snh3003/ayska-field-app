import React, { Component, ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Colors } from '@/constants/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // eslint-disable-next-line no-console
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <TamaguiView
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$xl"
          backgroundColor={Colors.light.background}
        >
          <TamaguiView marginBottom="$lg">
            <Ionicons
              name="alert-circle"
              size={64}
              color={Colors.light.error}
            />
          </TamaguiView>
          <TamaguiText
            fontSize="$6"
            fontWeight="700"
            color={Colors.light.text}
            marginBottom="$md"
            textAlign="center"
          >
            Oops! Something went wrong
          </TamaguiText>
          <TamaguiText
            fontSize="$4"
            color={Colors.light.textSecondary}
            textAlign="center"
            marginBottom="$lg"
          >
            We&apos;re sorry for the inconvenience. Please try again.
          </TamaguiText>
          {__DEV__ && error && (
            <TamaguiText
              fontSize="$2"
              color={Colors.light.error}
              textAlign="center"
              marginBottom="$lg"
              paddingHorizontal="$md"
            >
              {error.toString()}
            </TamaguiText>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.light.primary,
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
            onPress={this.handleReset}
          >
            <TamaguiText fontSize="$4" fontWeight="600" color="#FFFFFF">
              Try Again
            </TamaguiText>
          </TouchableOpacity>
        </TamaguiView>
      );
    }

    return children;
  }
}
