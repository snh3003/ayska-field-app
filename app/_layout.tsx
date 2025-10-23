import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import {
  ThemeProvider,
  useColorScheme,
  useTheme,
} from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ErrorBoundary } from '../src/components/feedback/AyskaErrorBoundaryComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from '@tamagui/core';
import tamaguiConfig from '../tamagui.config';
import { ReactNode } from 'react';

export const unstable_settings = {
  anchor: 'login',
};

function TamaguiWrapper({ children }: { children: ReactNode }) {
  const { colorScheme } = useTheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
      {children}
    </TamaguiProvider>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="doctor/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="employee/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="notification/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        animated={true}
      />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <TamaguiWrapper>
            <ToastProvider>
              <ErrorBoundary>
                <RootLayoutContent />
              </ErrorBoundary>
            </ToastProvider>
          </TamaguiWrapper>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
