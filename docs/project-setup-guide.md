# Ayska Field App - Project Setup Guide

## 🚀 Overview

Getting the Ayska Field App running is like **setting up a new workspace** - you need the right tools, proper environment, and know where everything is located. This guide will get you up and running quickly!

## 📋 Prerequisites

### Required Software

Think of these like **essential tools in a workshop** - you need them before you can start building:

#### 1. Node.js (18+)

```bash
# Check your version
node --version
# Should be 18.0.0 or higher

# If you need to install/update:
# Visit: https://nodejs.org/
```

#### 2. Package Manager

```bash
# npm (comes with Node.js)
npm --version

# OR yarn (alternative)
yarn --version
```

#### 3. Expo CLI

```bash
# Install globally
npm install -g @expo/cli

# Verify installation
expo --version
```

### Platform-Specific Requirements

#### iOS Development (macOS only)

Think of iOS development like **building for Apple's ecosystem** - you need Apple's tools:

```bash
# Xcode (from App Store)
# - Xcode 14+ required
# - iOS 13+ deployment target

# CocoaPods (for iOS dependencies)
sudo gem install cocoapods

# Verify installation
pod --version
```

#### Android Development

Think of Android development like **building for Google's ecosystem** - you need Google's tools:

```bash
# Android Studio
# - Download from: https://developer.android.com/studio
# - Install Android SDK (API level 33+)
# - Set up Android emulator

# Java Development Kit (JDK)
# - JDK 17+ required
# - Set JAVA_HOME environment variable
```

## 🏗️ Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd ayska-field-app

# Verify you're in the right directory
ls -la
# Should see: package.json, src/, app/, etc.
```

### 2. Install Dependencies

```bash
# Install all dependencies (like stocking your workshop)
npm install

# This installs:
# - React Native dependencies
# - Expo dependencies
# - Tamagui UI library
# - Redux Toolkit
# - Testing libraries
# - Development tools
```

### 3. Platform-Specific Setup

#### iOS Setup (macOS only)

```bash
# Navigate to iOS directory
cd ios

# Install iOS dependencies (like getting iOS-specific tools)
pod install

# Return to project root
cd ..
```

#### Android Setup

```bash
# Android dependencies are handled by npm install
# But you need to set up Android Studio and emulator

# Verify Android setup
npx expo doctor
# This will check for common issues
```

## 🏃‍♂️ Running the App

### Development Server

```bash
# Start the development server (like starting your car)
npm start

# This will:
# - Start Metro bundler
# - Open Expo DevTools
# - Show QR code for mobile testing
```

### Platform-Specific Commands

#### iOS Simulator

```bash
# Run on iOS simulator (like driving on iOS roads)
npm run ios

# This will:
# - Open iOS simulator
# - Install and run the app
# - Enable hot reloading
```

#### Android Emulator

```bash
# Run on Android emulator (like driving on Android roads)
npm run android

# This will:
# - Open Android emulator
# - Install and run the app
# - Enable hot reloading
```

#### Web Browser

```bash
# Run in web browser (like driving on web roads)
npm run web

# This will:
# - Open in your default browser
# - Enable hot reloading
# - Show web-specific features
```

## ⚙️ Environment Configuration

### API Endpoints

Currently using **mock data** - like having a practice kitchen before the real restaurant:

```typescript
// src/api/placeholders.ts
export const API_BASE_URL = 'https://api.ayska.com'; // Future real API
export const MOCK_DATA = true; // Currently using mock data
```

### Map Provider Configuration

```typescript
// src/config/maps.ts
export const MapsConfig = {
  provider: 'google', // or 'mappls'
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
};
```

### Storage Configuration

```typescript
// Storage keys and prefixes
const STORAGE_KEYS = {
  AUTH: 'auth_',
  CACHE: 'cache_',
  DRAFT: 'draft_',
  SETTINGS: 'settings_',
};
```

## 🛠️ Development Tools

### Code Quality Tools

#### Linting

```bash
# Check for code issues (like a spell-checker)
npm run lint

# Auto-fix issues (like auto-correct)
npm run lint:fix

# Check for unused imports
npm run lint:unused
npm run lint:unused:fix
```

#### Type Checking

```bash
# Check TypeScript types (like grammar checking)
npm run type-check

# This will:
# - Check all TypeScript files
# - Report type errors
# - Ensure type safety
```

### Testing Tools

#### Running Tests

```bash
# Run all tests (like quality control)
npm test

# Watch mode (like continuous monitoring)
npm run test:watch

# Coverage report (like a health check)
npm test -- --coverage
```

#### Test Structure

```
__tests__/
├── components/          # Component tests
├── services/           # Service tests
├── repositories/       # Repository tests
└── setup.ts           # Test configuration
```

### Maintenance Tools

#### Clean Project

```bash
# Reset project (like spring cleaning)
npm run reset-project

# This will:
# - Clear Metro cache
# - Clear node_modules
# - Reinstall dependencies
```

#### Check Duplicates

```bash
# Find duplicate code (like finding duplicate files)
npm run check-duplicates

# This will:
# - Scan for duplicate code
# - Report potential issues
# - Suggest improvements
```

## 📁 Project Structure Reference

### Key Directories

Think of the project structure like a **well-organized office building**:

```
ayska-field-app/
├── 📱 app/                    # Expo Router screens
│   ├── (tabs)/               # Tab navigation
│   ├── admin/                # Admin screens
│   ├── employee/              # Employee screens
│   └── login.tsx              # Login screen
├── 🎨 src/                    # Source code
│   ├── components/           # UI components
│   │   ├── ui/               # Base components
│   │   ├── business/         # Business components
│   │   └── forms/            # Form components
│   ├── services/             # Business logic
│   ├── repositories/         # Data access
│   ├── store/                # Redux state
│   ├── interfaces/           # TypeScript interfaces
│   └── di/                   # Dependency injection
├── 🧪 __tests__/             # Test files
├── 📱 ios/                    # iOS-specific code
├── 🤖 android/                # Android-specific code
└── 📄 package.json           # Project configuration
```

### Where to Find What

#### Components

```bash
# Base UI components
src/components/ui/

# Business components
src/components/business/

# Form components
src/components/forms/
```

#### Services

```bash
# Business logic services
src/services/

# Data access repositories
src/repositories/
```

#### State Management

```bash
# Redux slices
src/store/slices/

# Store configuration
src/store/AyskaConfigureStore.ts
```

#### Types & Interfaces

```bash
# TypeScript interfaces
src/interfaces/

# Type definitions
src/types/
```

## 🚨 Common Issues & Troubleshooting

### Metro Bundler Issues

```bash
# Clear Metro cache (like clearing your browser cache)
npx expo start --clear

# Or reset everything
npm run reset-project
```

### iOS Build Failures

```bash
# Clean iOS build
cd ios
rm -rf build
pod install
cd ..

# Try again
npm run ios
```

### Android Gradle Issues

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Try again
npm run android
```

### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Common fixes:
# - Check import paths
# - Verify interface definitions
# - Ensure proper typing
```

### Linter Errors

```bash
# Auto-fix linting issues
npm run lint:fix

# Check specific rules
npm run lint -- --rule 'unused-imports/no-unused-imports'
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use yarn
rm -rf node_modules yarn.lock
yarn install
```

## 🔧 Useful Commands

### Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Check for issues
npx expo doctor
```

### Code Quality Commands

```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm test
npm run test:watch
```

### Maintenance Commands

```bash
# Clean project
npm run reset-project

# Check duplicates
npm run check-duplicates

# Pre-commit checks
npm run pre-commit
```

### Debugging Commands

```bash
# Check Expo configuration
npx expo doctor

# Check React Native version
npx react-native --version

# Check Expo version
npx expo --version
```

## 🎯 Quick Start Checklist

### ✅ Initial Setup

- [ ] Node.js 18+ installed
- [ ] Expo CLI installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] iOS setup completed (`cd ios && pod install`) (macOS only)
- [ ] Android Studio and emulator set up

### ✅ Running the App

- [ ] Development server started (`npm start`)
- [ ] App runs on iOS simulator (`npm run ios`)
- [ ] App runs on Android emulator (`npm run android`)
- [ ] App runs in web browser (`npm run web`)

### ✅ Development Tools

- [ ] Linting works (`npm run lint`)
- [ ] Type checking works (`npm run type-check`)
- [ ] Tests run (`npm test`)
- [ ] Hot reloading works

### ✅ Troubleshooting

- [ ] Metro cache cleared if needed
- [ ] iOS build works (macOS only)
- [ ] Android build works
- [ ] No TypeScript errors
- [ ] No linter errors

## 🔗 Next Steps

- Read the [Developer Guide](./dev-guide.md) to understand the architecture
- Check the [Data Flow Guide](./data-flow-guide.md) to understand data flow
- Review the [UI Best Practices](./ui-best-practices.md) for component guidelines
- Study the [Design Patterns Guide](./design-patterns-guide.md) for architectural patterns

---

**Remember**: Setting up a development environment is like **preparing a workshop** - you need the right tools, proper organization, and know where everything is located. Once it's set up, you can focus on building amazing features! 🚀
