import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '../components/ui/Card';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../components/ui/ButtonSecondary';
import { EmptyState } from '../components/feedback/EmptyState';
import { localDataService } from '../services/LocalDataService';
import {
  Assignment,
  Attendance,
  Doctor,
  Employee,
  Notification,
  Visit,
} from '../types';
import { formatRelativeTime } from '../../utils/dateTime';
import { hapticFeedback } from '../../utils/haptics';

export default function NotificationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [relatedData, setRelatedData] = useState<{
    doctor?: Doctor;
    employee?: Employee;
    visit?: Visit;
    attendance?: Attendance;
    assignment?: Assignment;
  }>({});

  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    if (id) {
      const notificationData = localDataService.getById<Notification>(
        'notifications' as any,
        id
      );
      setNotification(notificationData);

      if (notificationData?.actionData) {
        const { doctorId, employeeId, visitId, attendanceId, assignmentId } =
          notificationData.actionData;

        const data: typeof relatedData = {};

        if (doctorId) {
          const doctor = localDataService.getById<Doctor>('doctors', doctorId);
          if (doctor) data.doctor = doctor;
        }
        if (employeeId) {
          const employee = localDataService.getById<Employee>(
            'employees',
            employeeId
          );
          if (employee) data.employee = employee;
        }
        if (visitId) {
          const visit = localDataService.getById<Visit>('visits', visitId);
          if (visit) data.visit = visit;
        }
        if (attendanceId) {
          const attendance = localDataService.getById<Attendance>(
            'attendance',
            attendanceId
          );
          if (attendance) data.attendance = attendance;
        }
        if (assignmentId) {
          const assignment = localDataService.getById<Assignment>(
            'assignments',
            assignmentId
          );
          if (assignment) data.assignment = assignment;
        }

        setRelatedData(data);
      }
    }
  }, [id]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'visit':
        return 'location-outline';
      case 'assignment':
        return 'person-add-outline';
      case 'attendance':
        return 'time-outline';
      case 'system':
        return 'settings-outline';
      case 'alert':
        return 'warning-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'visit':
        return theme.primary;
      case 'assignment':
        return theme.secondary;
      case 'attendance':
        return theme.success;
      case 'system':
        return theme.info;
      case 'alert':
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'visit':
        return theme.primaryBg;
      case 'assignment':
        return theme.secondaryBg;
      case 'attendance':
        return theme.successBg;
      case 'system':
        return theme.infoBg;
      case 'alert':
        return theme.warningBg;
      default:
        return theme.card;
    }
  };

  const handleCall = (phone: string) => {
    hapticFeedback.light();
    Linking.openURL(`tel:${phone}`);
  };

  const handleViewDoctor = (doctorId: string) => {
    hapticFeedback.light();
    router.push(`/doctor/${doctorId}` as any);
  };

  const handleViewEmployee = (employeeId: string) => {
    hapticFeedback.light();
    router.push(`/employee/${employeeId}` as any);
  };

  if (!notification) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <EmptyState
          icon="alert-circle"
          title="Notification Not Found"
          message="This notification could not be found or may have been deleted."
        />
      </SafeAreaView>
    );
  }

  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);
  const iconBgColor = getNotificationBgColor(notification.type);

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
            Notification Details
          </TamaguiText>
          <TamaguiView width={44} />
        </TamaguiView>

        {/* Notification Hero Card */}
        <Card
          variant="elevated"
          style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}
        >
          <TamaguiView flexDirection="row" alignItems="flex-start">
            <TamaguiView
              width={64}
              height={64}
              borderRadius="$lg"
              justifyContent="center"
              alignItems="center"
              marginRight="$md"
              backgroundColor={iconBgColor}
            >
              <Ionicons name={iconName as any} size={32} color={iconColor} />
            </TamaguiView>

            <TamaguiView flex={1}>
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$xs"
              >
                <TamaguiText
                  fontSize="$5"
                  fontWeight="700"
                  color="$text"
                  flex={1}
                >
                  {notification.title}
                </TamaguiText>
                <TamaguiView
                  paddingHorizontal="$sm"
                  paddingVertical="$xs"
                  borderRadius="$sm"
                  backgroundColor={iconBgColor}
                >
                  <TamaguiText
                    fontSize="$2"
                    fontWeight="600"
                    color={iconColor}
                    textTransform="uppercase"
                  >
                    {notification.type}
                  </TamaguiText>
                </TamaguiView>
              </TamaguiView>

              <TamaguiText
                fontSize="$4"
                lineHeight="$6"
                color="$textSecondary"
                marginBottom="$sm"
              >
                {notification.message}
              </TamaguiText>

              <TamaguiView flexDirection="row" alignItems="center">
                <Ionicons name="time-outline" size={16} color={theme.icon} />
                <TamaguiText
                  fontSize="$3"
                  color="$textSecondary"
                  marginLeft="$xs"
                >
                  {formatRelativeTime(notification.timestamp)}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
          </TamaguiView>
        </Card>

        {/* Type-specific Detail Sections */}
        {notification.type === 'visit' &&
          (relatedData.doctor || relatedData.employee || relatedData.visit) && (
            <>
              {relatedData.visit && (
                <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
                  <TamaguiText
                    fontSize="$5"
                    fontWeight="600"
                    color="$text"
                    marginBottom="$md"
                  >
                    Visit Details
                  </TamaguiText>

                  <TamaguiView
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="$sm"
                  >
                    <Ionicons name="time" size={20} color={theme.primary} />
                    <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                      Check-in:{' '}
                      {new Date(relatedData.visit.checkInTime).toLocaleString()}
                    </TamaguiText>
                  </TamaguiView>

                  {relatedData.visit.checkOutTime && (
                    <TamaguiView
                      flexDirection="row"
                      alignItems="center"
                      marginBottom="$sm"
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.success}
                      />
                      <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                        Check-out:{' '}
                        {new Date(
                          relatedData.visit.checkOutTime
                        ).toLocaleString()}
                      </TamaguiText>
                    </TamaguiView>
                  )}

                  {relatedData.visit.notes && (
                    <TamaguiView
                      flexDirection="row"
                      alignItems="flex-start"
                      marginBottom="$sm"
                    >
                      <Ionicons
                        name="document-text"
                        size={20}
                        color={theme.info}
                      />
                      <TamaguiText
                        fontSize="$4"
                        color="$text"
                        marginLeft="$sm"
                        flex={1}
                      >
                        Notes: {relatedData.visit.notes}
                      </TamaguiText>
                    </TamaguiView>
                  )}

                  <TamaguiView
                    paddingHorizontal="$sm"
                    paddingVertical="$xs"
                    borderRadius="$sm"
                    backgroundColor={
                      relatedData.visit.status === 'completed'
                        ? theme.successBg
                        : theme.warningBg
                    }
                    alignSelf="flex-start"
                  >
                    <TamaguiText
                      fontSize="$2"
                      fontWeight="600"
                      color={
                        relatedData.visit.status === 'completed'
                          ? theme.success
                          : theme.warning
                      }
                    >
                      {relatedData.visit.status === 'completed'
                        ? 'Completed'
                        : 'In Progress'}
                    </TamaguiText>
                  </TamaguiView>
                </Card>
              )}
            </>
          )}

        {notification.type === 'assignment' &&
          (relatedData.doctor ||
            relatedData.employee ||
            relatedData.assignment) && (
            <>
              {relatedData.assignment && (
                <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
                  <TamaguiText
                    fontSize="$5"
                    fontWeight="600"
                    color="$text"
                    marginBottom="$md"
                  >
                    Assignment Details
                  </TamaguiText>

                  <TamaguiView
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="$sm"
                  >
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={theme.secondary}
                    />
                    <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                      Assigned:{' '}
                      {new Date(
                        relatedData.assignment.assignedDate
                      ).toLocaleDateString()}
                    </TamaguiText>
                  </TamaguiView>

                  <TamaguiView
                    paddingHorizontal="$sm"
                    paddingVertical="$xs"
                    borderRadius="$sm"
                    backgroundColor={
                      relatedData.assignment.status === 'active'
                        ? theme.successBg
                        : relatedData.assignment.status === 'completed'
                          ? theme.infoBg
                          : theme.errorBg
                    }
                    alignSelf="flex-start"
                  >
                    <TamaguiText
                      fontSize="$2"
                      fontWeight="600"
                      color={
                        relatedData.assignment.status === 'active'
                          ? theme.success
                          : relatedData.assignment.status === 'completed'
                            ? theme.info
                            : theme.error
                      }
                    >
                      {relatedData.assignment.status.charAt(0).toUpperCase() +
                        relatedData.assignment.status.slice(1)}
                    </TamaguiText>
                  </TamaguiView>
                </Card>
              )}
            </>
          )}

        {notification.type === 'attendance' &&
          (relatedData.employee || relatedData.attendance) && (
            <>
              {relatedData.attendance && (
                <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
                  <TamaguiText
                    fontSize="$5"
                    fontWeight="600"
                    color="$text"
                    marginBottom="$md"
                  >
                    Attendance Details
                  </TamaguiText>

                  <TamaguiView
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="$sm"
                  >
                    <Ionicons name="time" size={20} color={theme.success} />
                    <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                      Start:{' '}
                      {new Date(
                        relatedData.attendance.startTime
                      ).toLocaleString()}
                    </TamaguiText>
                  </TamaguiView>

                  {relatedData.attendance.endTime && (
                    <TamaguiView
                      flexDirection="row"
                      alignItems="center"
                      marginBottom="$sm"
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.success}
                      />
                      <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                        End:{' '}
                        {new Date(
                          relatedData.attendance.endTime
                        ).toLocaleString()}
                      </TamaguiText>
                    </TamaguiView>
                  )}

                  <TamaguiView
                    flexDirection="row"
                    alignItems="center"
                    marginBottom="$sm"
                  >
                    <Ionicons name="calendar" size={20} color={theme.info} />
                    <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                      Date:{' '}
                      {new Date(
                        relatedData.attendance.date
                      ).toLocaleDateString()}
                    </TamaguiText>
                  </TamaguiView>
                </Card>
              )}
            </>
          )}

        {/* Related Entity Cards */}
        {relatedData.doctor && (
          <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
            <TamaguiText
              fontSize="$5"
              fontWeight="600"
              color="$text"
              marginBottom="$md"
            >
              Doctor Information
            </TamaguiText>

            <TamaguiView
              flexDirection="row"
              alignItems="center"
              marginBottom="$sm"
            >
              <TamaguiView
                width={48}
                height={48}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                marginRight="$md"
                backgroundColor={theme.primaryBg}
              >
                <Ionicons name="person" size={24} color={theme.primary} />
              </TamaguiView>

              <TamaguiView flex={1}>
                <TamaguiText fontSize="$4" fontWeight="600" color="$text">
                  {relatedData.doctor.name}
                </TamaguiText>
                <TamaguiText fontSize="$3" color="$textSecondary">
                  {relatedData.doctor.specialization}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>

            {relatedData.doctor.phone && (
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$sm"
              >
                <Ionicons name="call" size={20} color={theme.success} />
                <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                  {relatedData.doctor.phone}
                </TamaguiText>
              </TamaguiView>
            )}

            <TamaguiView flexDirection="row" alignItems="center">
              <Ionicons name="location" size={20} color={theme.info} />
              <TamaguiText fontSize="$4" color="$text" marginLeft="$sm">
                Lat: {relatedData.doctor.location.lat.toFixed(4)}, Lng:{' '}
                {relatedData.doctor.location.lng.toFixed(4)}
              </TamaguiText>
            </TamaguiView>
          </Card>
        )}

        {relatedData.employee && (
          <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
            <TamaguiText
              fontSize="$5"
              fontWeight="600"
              color="$text"
              marginBottom="$md"
            >
              Employee Information
            </TamaguiText>

            <TamaguiView
              flexDirection="row"
              alignItems="center"
              marginBottom="$sm"
            >
              <TamaguiView
                width={48}
                height={48}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                marginRight="$md"
                backgroundColor={theme.secondaryBg}
              >
                <Ionicons name="person" size={24} color={theme.secondary} />
              </TamaguiView>

              <TamaguiView flex={1}>
                <TamaguiText fontSize="$4" fontWeight="600" color="$text">
                  {relatedData.employee.name}
                </TamaguiText>
                <TamaguiText fontSize="$3" color="$textSecondary">
                  {relatedData.employee.email}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
          </Card>
        )}

        {/* Action Buttons */}
        <TamaguiView flexDirection="row" gap="$md" marginTop="$lg">
          {relatedData.doctor && (
            <>
              <ButtonPrimary
                title="View Doctor"
                onPress={() => handleViewDoctor(relatedData.doctor!.id)}
                style={{ flex: 1 }}
              />
              {relatedData.doctor.phone && (
                <ButtonSecondary
                  title="Call"
                  onPress={() => handleCall(relatedData.doctor!.phone!)}
                  style={{ flex: 1 }}
                />
              )}
            </>
          )}

          {relatedData.employee && (
            <ButtonPrimary
              title="View Employee"
              onPress={() => handleViewEmployee(relatedData.employee!.id)}
              style={{ flex: 1 }}
            />
          )}
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
