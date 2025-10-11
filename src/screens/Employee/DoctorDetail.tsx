import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { localDataService } from '../../services/LocalDataService';
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle" size={64} color={theme.textSecondary} />
          <Text
            style={[
              Typography.h4,
              { color: theme.textSecondary, marginTop: Spacing.md },
            ]}
          >
            Doctor not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[Typography.h3, { color: theme.text }]}>
            Doctor Details
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Doctor Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: theme.primary + '15' },
              ]}
            >
              <Ionicons name="person" size={48} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[Typography.h2, { color: theme.text }]}>
                {doctor.name}
              </Text>
              <Text
                style={[
                  Typography.body,
                  { color: theme.textSecondary, marginTop: Spacing.xs },
                ]}
              >
                {doctor.specialization}
              </Text>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Text
          style={[
            Typography.h4,
            {
              color: theme.text,
              marginBottom: Spacing.md,
              marginTop: Spacing.lg,
            },
          ]}
        >
          Contact Information
        </Text>

        {doctor.phone && (
          <Card variant="elevated">
            <TouchableOpacity onPress={handleCall} style={styles.contactRow}>
              <View
                style={[
                  styles.contactIcon,
                  { backgroundColor: theme.success + '15' },
                ]}
              >
                <Ionicons name="call" size={24} color={theme.success} />
              </View>
              <View style={styles.contactInfo}>
                <Text
                  style={[Typography.caption, { color: theme.textSecondary }]}
                >
                  Phone Number
                </Text>
                <Text
                  style={[
                    Typography.body,
                    { color: theme.text, marginTop: Spacing.xs },
                  ]}
                >
                  {doctor.phone}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </TouchableOpacity>
          </Card>
        )}

        <Card variant="elevated" style={{ marginTop: Spacing.md }}>
          <View style={styles.contactRow}>
            <View
              style={[
                styles.contactIcon,
                { backgroundColor: theme.info + '15' },
              ]}
            >
              <Ionicons name="location" size={24} color={theme.info} />
            </View>
            <View style={styles.contactInfo}>
              <Text
                style={[Typography.caption, { color: theme.textSecondary }]}
              >
                Location
              </Text>
              <Text
                style={[
                  Typography.body,
                  { color: theme.text, marginTop: Spacing.xs },
                ]}
              >
                Lat: {doctor.location.lat.toFixed(4)}, Lng:{' '}
                {doctor.location.lng.toFixed(4)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Visit History */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h4, { color: theme.text }]}>
            Visit History
          </Text>
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>
            {visits.length} visit{visits.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {visits.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <Text
              style={[
                Typography.body,
                {
                  color: theme.textSecondary,
                  marginTop: Spacing.md,
                  textAlign: 'center',
                },
              ]}
            >
              No visits recorded yet
            </Text>
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
                <View style={styles.visitRow}>
                  <View
                    style={[
                      styles.visitIcon,
                      {
                        backgroundColor: isCompleted
                          ? theme.success + '15'
                          : theme.warning + '15',
                      },
                    ]}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'time'}
                      size={20}
                      color={isCompleted ? theme.success : theme.warning}
                    />
                  </View>
                  <View style={styles.visitInfo}>
                    <Text
                      style={[
                        Typography.body,
                        { color: theme.text, fontWeight: '600' },
                      ]}
                    >
                      {new Date(visit.checkInTime).toLocaleDateString()}
                    </Text>
                    <Text
                      style={[
                        Typography.caption,
                        { color: theme.textSecondary, marginTop: Spacing.xs },
                      ]}
                    >
                      {new Date(visit.checkInTime).toLocaleTimeString()}
                      {visit.checkOutTime &&
                        ` - ${new Date(visit.checkOutTime).toLocaleTimeString()}`}
                    </Text>
                    {visit.notes && (
                      <Text
                        style={[
                          Typography.bodySmall,
                          { color: theme.textSecondary, marginTop: Spacing.xs },
                        ]}
                      >
                        {visit.notes}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isCompleted
                          ? theme.success
                          : theme.warning,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.caption,
                        { color: '#FFFFFF', fontWeight: '600' },
                      ]}
                    >
                      {isCompleted ? 'Done' : 'Active'}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  profileCard: {
    padding: Spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
  },
});
