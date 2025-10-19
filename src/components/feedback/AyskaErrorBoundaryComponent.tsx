import React, { Component, ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { useTheme } from '../../../utils/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryWithThemeProps extends Props {
  theme: any;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryWithThemeProps, State> {
  constructor(props: ErrorBoundaryWithThemeProps) {
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
    const { fallback, children, theme } = this.props;

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
          backgroundColor={theme.background}
        >
          <TamaguiView marginBottom="$lg">
            <Ionicons name="alert-circle" size={64} color={theme.error} />
          </TamaguiView>
          <AyskaTitleComponent
            level={2}
            weight="bold"
            color="text"
            align="center"
            style={{ marginBottom: 16 }}
          >
            Oops! Something went wrong
          </AyskaTitleComponent>
          <AyskaTextComponent
            variant="bodyLarge"
            color="textSecondary"
            align="center"
            style={{ marginBottom: 24 }}
          >
            We&apos;re sorry for the inconvenience. Please try again.
          </AyskaTextComponent>
          {__DEV__ && error && (
            <AyskaTextComponent
              variant="bodySmall"
              color="error"
              align="center"
              style={{ marginBottom: 24, paddingHorizontal: 16 }}
            >
              {error.toString()}
            </AyskaTextComponent>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: theme.primary,
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
            onPress={this.handleReset}
          >
            <AyskaTextComponent
              variant="bodyLarge"
              weight="semibold"
              color="text"
              style={{ color: 'white' }}
            >
              Try Again
            </AyskaTextComponent>
          </TouchableOpacity>
        </TamaguiView>
      );
    }

    return children;
  }
}

// Functional component wrapper that uses the theme hook
export const ErrorBoundary: React.FC<Props> = props => {
  const theme = useTheme();
  return <ErrorBoundaryClass {...props} theme={theme} />;
};
