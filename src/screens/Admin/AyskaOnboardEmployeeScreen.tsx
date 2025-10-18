import React from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardEmployeeForm } from '../../components/forms/AyskaOnboardEmployeeFormComponent';
// import { useAuth } from '../../../hooks/useAuth';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { hapticFeedback } from '../../../utils/haptics';

export default function OnboardEmployeeScreen() {
  // const { user: _user } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleSuccess = () => {
    hapticFeedback.success();
    router.back();
  };

  const handleBack = () => {
    hapticFeedback.light();
    router.back();
  };

  const handleClose = () => {
    hapticFeedback.medium();
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Custom Header */}
        <TamaguiView
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="$md"
          backgroundColor="$card"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.background,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <TamaguiText fontSize="$6" fontWeight="600" color="$text">
            Add Employee
          </TamaguiText>

          <TouchableOpacity
            onPress={handleClose}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.background,
            }}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </TamaguiView>

        <ScrollView style={{ flex: 1 }}>
          <TamaguiView padding="$md">
            <TamaguiView
              backgroundColor="$card"
              borderRadius="$md"
              padding="$md"
              marginBottom="$md"
            >
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$md"
              >
                <Ionicons name="person-add" size={24} color={theme.primary} />
                <TamaguiText
                  fontSize="$5"
                  fontWeight="bold"
                  color="$text"
                  marginLeft="$sm"
                >
                  New Employee Details
                </TamaguiText>
              </TamaguiView>

              <TamaguiText
                fontSize="$3"
                color="$textSecondary"
                marginBottom="$md"
              >
                Fill in the details below to onboard a new employee. They will
                receive a welcome email with temporary login credentials.
              </TamaguiText>

              <OnboardEmployeeForm onSuccess={handleSuccess} />
            </TamaguiView>
          </TamaguiView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
