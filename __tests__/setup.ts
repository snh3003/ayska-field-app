// import '@testing-library/react-native/extend-expect';

// Mock Tamagui components
jest.mock('@tamagui/core', () => ({
  Text: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('Text', props, children);
  },
  View: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', props, children);
  },
  createTamagui: jest.fn(),
  TamaguiProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@tamagui/button', () => ({
  Button: 'Button',
}));

jest.mock('@tamagui/input', () => ({
  Input: 'Input',
}));

// Mock Expo modules
jest.mock('expo-haptics', () => ({
  hapticFeedback: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios || obj.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  useColorScheme: jest.fn(() => 'light'),
  TouchableOpacity: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('TouchableOpacity', props, children);
  },
  TextInput: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('TextInput', props, children);
  },
  ActivityIndicator: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('ActivityIndicator', props, children);
  },
  Animated: {
    Value: jest.fn(value => ({ value })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    parallel: jest.fn(() => ({
      start: jest.fn(),
    })),
    View: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('AnimatedView', props, children);
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Global test utilities
(global as any).__DEV__ = true;

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
