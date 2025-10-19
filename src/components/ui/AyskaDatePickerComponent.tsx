import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaLabelComponent } from './AyskaLabelComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaTextComponent } from './AyskaTextComponent';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../navigation/AyskaBottomSheetComponent';
import { PickerWheel } from './AyskaPickerWheelComponent';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { DatePickerProps } from '../../types';

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = 'Select date',
  value,
  onChange,
  onBlur,
  error,
  style,
  icon,
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Initialize with selected date if available, otherwise current date
    return value ? new Date(value) : new Date();
  });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const selectedDate = value ? new Date(value) : null;

  // Update currentMonth when value prop changes
  useEffect(() => {
    if (__DEV__) {
      console.log('DatePicker: value prop changed to:', value);
    }
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleMonthPickerOpen = () => {
    setShowMonthPicker(true);
  };

  const handleYearPickerOpen = () => {
    setShowYearPicker(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    if (__DEV__) {
      console.log(
        'DatePicker: Selected date:',
        date,
        'Formatted:',
        formattedDate
      );
    }
    if (formattedDate) {
      onChange(formattedDate);
      handleClose();
    }
  };

  const formatDisplayValue = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    if (__DEV__) {
      console.log(
        'DatePicker: formatDisplayValue - input:',
        dateString,
        'output:',
        formatted
      );
    }
    return formatted;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate years array based on minDate and maxDate
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const minYear = minDate
      ? new Date(minDate).getFullYear()
      : currentYear - 100;
    const maxYear = maxDate
      ? new Date(maxDate).getFullYear()
      : currentYear + 10;

    const years: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const years = generateYears();

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setShowYearPicker(false);
  };

  return (
    <TamaguiView style={style} marginBottom={16}>
      {label && (
        <AyskaLabelComponent style={{ marginBottom: 8 }}>
          {label}
        </AyskaLabelComponent>
      )}

      <TouchableOpacity onPress={handleOpen}>
        <TamaguiView
          borderColor={error ? theme.error : theme.border}
          backgroundColor={theme.card}
          borderWidth={1}
          borderRadius={12}
          padding={12}
          flexDirection="row"
          alignItems="center"
        >
          {icon && <TamaguiView marginRight={8}>{icon}</TamaguiView>}
          <AyskaTextComponent
            color={value ? 'text' : 'textSecondary'}
            style={{ flex: 1 }}
          >
            {value ? formatDisplayValue(value) : placeholder}
          </AyskaTextComponent>
        </TamaguiView>
      </TouchableOpacity>

      {error && (
        <AyskaCaptionComponent color="error" style={{ marginTop: 4 }}>
          {error}
        </AyskaCaptionComponent>
      )}

      <BottomSheet
        isVisible={isOpen}
        onClose={handleClose}
        title="Select Date"
        height={400}
      >
        <TamaguiView>
          {/* Month Navigation */}
          <TamaguiView
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$md"
          >
            <TouchableOpacity
              onPress={() => navigateMonth('prev')}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: theme.background,
              }}
            >
              <Ionicons name="chevron-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <TamaguiView flexDirection="row" alignItems="center" gap="$sm">
              <TouchableOpacity
                onPress={handleMonthPickerOpen}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: theme.background,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <AyskaTextComponent weight="semibold" color="text">
                  {months[currentMonth.getMonth()]}
                </AyskaTextComponent>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={theme.text}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleYearPickerOpen}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: theme.background,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <AyskaTextComponent weight="semibold" color="text">
                  {currentMonth.getFullYear()}
                </AyskaTextComponent>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={theme.text}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </TamaguiView>

            <TouchableOpacity
              onPress={() => navigateMonth('next')}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: theme.background,
              }}
            >
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </TouchableOpacity>
          </TamaguiView>

          {/* Week Days Header */}
          <TamaguiView flexDirection="row" marginBottom="$sm">
            {weekDays.map(day => (
              <TamaguiView
                key={day}
                flex={1}
                alignItems="center"
                paddingVertical="$sm"
              >
                <AyskaCaptionComponent
                  color="textSecondary"
                  style={{ fontWeight: '600' }}
                >
                  {day}
                </AyskaCaptionComponent>
              </TamaguiView>
            ))}
          </TamaguiView>

          {/* Calendar Grid */}
          <TamaguiView>
            {Array.from(
              { length: Math.ceil(monthDays.length / 7) },
              (_, weekIndex) => (
                <TamaguiView
                  key={weekIndex}
                  flexDirection="row"
                  marginBottom="$xs"
                >
                  {monthDays
                    .slice(weekIndex * 7, (weekIndex + 1) * 7)
                    .map((date, dayIndex) => (
                      <TamaguiView
                        key={dayIndex}
                        flex={1}
                        alignItems="center"
                        paddingVertical="$sm"
                      >
                        {date ? (
                          <TouchableOpacity
                            onPress={() => handleDateSelect(date)}
                            disabled={isDateDisabled(date)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isDateSelected(date)
                                ? theme.primary
                                : isToday(date)
                                  ? theme.background
                                  : 'transparent',
                              borderWidth: isToday(date) ? 1 : 0,
                              borderColor: isToday(date)
                                ? theme.primary
                                : 'transparent',
                              opacity: isDateDisabled(date) ? 0.3 : 1,
                            }}
                          >
                            <AyskaCaptionComponent
                              style={{
                                color: isDateSelected(date)
                                  ? 'white'
                                  : isToday(date)
                                    ? theme.primary
                                    : theme.text,
                                fontWeight:
                                  isDateSelected(date) || isToday(date)
                                    ? '600'
                                    : '400',
                              }}
                            >
                              {date.getDate()}
                            </AyskaCaptionComponent>
                          </TouchableOpacity>
                        ) : (
                          <TamaguiView width={36} height={36} />
                        )}
                      </TamaguiView>
                    ))}
                </TamaguiView>
              )
            )}
          </TamaguiView>
        </TamaguiView>
      </BottomSheet>

      {/* Month Picker */}
      <BottomSheet
        isVisible={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        title="Select Month"
        height={300}
      >
        <TamaguiView padding="$md">
          <PickerWheel
            items={months}
            selectedIndex={currentMonth.getMonth()}
            onValueChange={handleMonthSelect}
            itemHeight={44}
            containerHeight={220}
          />
        </TamaguiView>
      </BottomSheet>

      {/* Year Picker */}
      <BottomSheet
        isVisible={showYearPicker}
        onClose={() => setShowYearPicker(false)}
        title="Select Year"
        height={400}
      >
        <TamaguiView padding="$md">
          <PickerWheel
            items={years}
            selectedIndex={(() => {
              const currentYear = currentMonth.getFullYear();
              const yearIndex = years.findIndex(year => year === currentYear);
              return yearIndex >= 0 ? yearIndex : 0;
            })()}
            onValueChange={index => {
              const selectedYear = years[index];
              if (selectedYear !== undefined) {
                handleYearSelect(selectedYear);
              }
            }}
            itemHeight={44}
            containerHeight={320}
          />
        </TamaguiView>
      </BottomSheet>
    </TamaguiView>
  );
};
