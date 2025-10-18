import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/AyskaCardComponent';
import { ButtonPrimary } from '../../components/ui/AyskaButtonPrimaryComponent';
import { ButtonSecondary } from '../../components/ui/AyskaButtonSecondaryComponent';
import { localDataService } from '../../services/AyskaLocalDataServiceService';
import { Doctor, Visit } from '../../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function DoctorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const { userId } = useSelector((s: RootState) => s.auth);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    if (id) {
      const doctorData = localDataService.getById<Doctor>('doctors', id);
      setDoctor(doctorData);

      if (userId) {
        const allVisits = localDataService.getAll<Visit>('visits');
        const doctorVisits = allVisits.filter(
          (v: Visit) => v.doctorId === id && v.employeeId === userId
        );
        setVisits(doctorVisits);
      }
    }
  }, [id, userId]);

  const handleCall = () => {
    if (doctor?.phone) {
      Linking.openURL(`tel:${doctor.phone}`);
    }
  };

  const handleCheckIn = () => {
    if (doctor && userId) {
      const visit: Visit = {
        id: `v_${Date.now()}`,
        employeeId: userId,
        doctorId: doctor.id,
        checkInTime: new Date().toISOString(),
        status: 'in_progress',
      };
      localDataService.add('visits', visit);
      router.back();
    }
  };

  if (!doctor) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <TamaguiView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="alert-circle" size={64} color={theme.textSecondary} />
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$textSecondary"
            marginTop="$md"
          >
            Doctor not found
          </TamaguiText>
        </TamaguiView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingBottom: Spacing.xxl,
        }}
      >
        {/* Header */}
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$lg"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.card,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <TamaguiText fontSize="$6" fontWeight="700" color="$text">
            Doctor Details
          </TamaguiText>
          <TamaguiView width={44} />
        </TamaguiView>

        {/* Doctor Profile Card */}
        <Card variant="elevated" style={{ padding: Spacing.lg }}>
          <TamaguiView alignItems="center">
            <TamaguiView
              width={96}
              height={96}
              borderRadius="$xl"
              justifyContent="center"
              alignItems="center"
              marginBottom="$md"
              backgroundColor={theme.avatarBg}
            >
              <Ionicons name="person" size={48} color={theme.primary} />
            </TamaguiView>
            <TamaguiView alignItems="center">
              <TamaguiText fontSize="$7" fontWeight="700" color="$text">
                {doctor.name}
              </TamaguiText>
              <TamaguiText
                fontSize="$4"
                lineHeight="$6"
                color="$textSecondary"
                marginTop="$xs"
              >
                {doctor.specialization}
              </TamaguiText>
            </TamaguiView>
          </TamaguiView>
        </Card>

        {/* Contact Information */}
        <TamaguiText
          fontSize="$5"
          fontWeight="600"
          color="$text"
          marginTop="$lg"
          marginBottom="$md"
        >
          Contact Information
        </TamaguiText>

        {doctor.phone && (
          <Card variant="elevated">
            <TouchableOpacity
              onPress={handleCall}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: Spacing.sm,
              }}
            >
              <TamaguiView
                width={48}
                height={48}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                marginRight="$md"
                backgroundColor={theme.successBg}
              >
                <Ionicons name="call" size={24} color={theme.success} />
              </TamaguiView>
              <TamaguiView flex={1}>
                <TamaguiText
                  fontSize="$2"
                  lineHeight="$4"
                  color="$textSecondary"
                >
                  Phone Number
                </TamaguiText>
                <TamaguiText
                  fontSize="$4"
                  lineHeight="$6"
                  color="$text"
                  marginTop="$xs"
                >
                  {doctor.phone}
                </TamaguiText>
              </TamaguiView>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </TouchableOpacity>
          </Card>
        )}

        <Card variant="elevated" style={{ marginTop: Spacing.md }}>
          <TamaguiView flexDirection="row" alignItems="center">
            <TamaguiView
              width={48}
              height={48}
              borderRadius="$md"
              justifyContent="center"
              alignItems="center"
              marginRight="$md"
              backgroundColor={theme.infoBg}
            >
              <Ionicons name="location" size={24} color={theme.info} />
            </TamaguiView>
            <TamaguiView flex={1}>
              <TamaguiText fontSize="$2" lineHeight="$4" color="$textSecondary">
                Location
              </TamaguiText>
              <TamaguiText
                fontSize="$4"
                lineHeight="$6"
                color="$text"
                marginTop="$xs"
              >
                Lat: {doctor.location.lat.toFixed(4)}, Lng:{' '}
                {doctor.location.lng.toFixed(4)}
              </TamaguiText>
            </TamaguiView>
          </TamaguiView>
        </Card>

        {/* Visit History */}
        <TamaguiView marginTop="$lg" marginBottom="$md">
          <TamaguiText fontSize="$5" fontWeight="600" color="$text">
            Visit History
          </TamaguiText>
          <TamaguiText fontSize="$2" lineHeight="$4" color="$textSecondary">
            {visits.length} visit{visits.length !== 1 ? 's' : ''}
          </TamaguiText>
        </TamaguiView>

        {visits.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <TamaguiText
              fontSize="$4"
              lineHeight="$6"
              color="$textSecondary"
              marginTop="$md"
              textAlign="center"
            >
              No visits recorded yet
            </TamaguiText>
          </Card>
        ) : (
          visits.map(visit => {
            const isCompleted = visit.status === 'completed';
            return (
              <Card
                key={visit.id}
                variant="outlined"
                style={{ marginBottom: Spacing.sm }}
              >
                <TamaguiView
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <TamaguiView
                    style={[
                      {
                        width: 48,
                        height: 48,
                        borderRadius: BorderRadius.md,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isCompleted
                          ? theme.successBg
                          : theme.warningBg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'time'}
                      size={20}
                      color={isCompleted ? theme.success : theme.warning}
                    />
                  </TamaguiView>
                  <TamaguiView style={{ flex: 1, marginLeft: Spacing.md }}>
                    <TamaguiText
                      fontSize="$4"
                      lineHeight="$6"
                      color="$text"
                      fontWeight="600"
                    >
                      {new Date(visit.checkInTime).toLocaleDateString()}
                    </TamaguiText>
                    <TamaguiText
                      fontSize="$2"
                      lineHeight="$4"
                      color="$textSecondary"
                      marginTop="$xs"
                    >
                      {new Date(visit.checkInTime).toLocaleTimeString()}
                      {visit.checkOutTime &&
                        ` - ${new Date(visit.checkOutTime).toLocaleTimeString()}`}
                    </TamaguiText>
                    {visit.notes && (
                      <TamaguiText
                        fontSize="$3"
                        lineHeight="$5"
                        color="$textSecondary"
                        marginTop="$xs"
                      >
                        {visit.notes}
                      </TamaguiText>
                    )}
                  </TamaguiView>
                  <TamaguiView
                    style={[
                      {
                        paddingHorizontal: Spacing.sm,
                        paddingVertical: Spacing.xs,
                        borderRadius: BorderRadius.sm,
                        backgroundColor: isCompleted ? '$success' : '$warning',
                      },
                    ]}
                  >
                    <TamaguiText
                      fontSize="$2"
                      lineHeight="$4"
                      color="#FFFFFF"
                      fontWeight="600"
                    >
                      {isCompleted ? 'Done' : 'Active'}
                    </TamaguiText>
                  </TamaguiView>
                </TamaguiView>
              </Card>
            );
          })
        )}

        {/* Actions */}
        <TamaguiView
          style={{
            flexDirection: 'row',
            gap: Spacing.md,
            marginTop: Spacing.lg,
          }}
        >
          <ButtonPrimary
            title="Check In"
            onPress={handleCheckIn}
            style={{ flex: 1, marginRight: Spacing.sm }}
          />
          {doctor.phone && (
            <ButtonSecondary
              title="Call"
              onPress={handleCall}
              style={{ flex: 1, marginLeft: Spacing.sm }}
            />
          )}
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
