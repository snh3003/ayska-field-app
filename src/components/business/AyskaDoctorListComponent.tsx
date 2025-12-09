// Doctor List Component - Complete UI for doctor management
// Implements doctor listing with search, filters, and actions

import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../contexts/ToastContext';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaActionButtonComponent } from '../ui/AyskaActionButtonComponent';
import { Input } from '../ui/AyskaInputComponent';
import { Card } from '../ui/AyskaCardComponent';
import { CardSkeleton } from '../feedback/AyskaSkeletonLoaderComponent';
import { EmptyState } from '../feedback/AyskaEmptyStateComponent';
import { ErrorBoundary } from '../feedback/AyskaErrorBoundaryComponent';
import {
  clearError,
  fetchDoctors,
  selectDoctorError,
  selectDoctorLoading,
  selectDoctorPagination,
  selectDoctors,
} from '../../store/slices/AyskaDoctorSlice';
import type { AppDispatch } from '../../store';
import type { Doctor } from '../../types/AyskaDoctorApiType';

interface DoctorListComponentProps {
  onDoctorSelect?: (_doctor: Doctor) => void;
  onAddDoctor?: () => void;
  showAddButton?: boolean;
  style?: any;
  _accessibilityHint?: string;
}

export const DoctorListComponent: React.FC<DoctorListComponentProps> = ({
  onDoctorSelect,
  onAddDoctor,
  showAddButton = true,
  style,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const doctors = useSelector(selectDoctors);
  const loading = useSelector(selectDoctorLoading);
  const error = useSelector(selectDoctorError);
  const pagination = useSelector(selectDoctorPagination);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({ page: 1, size: 10 });
  const [refreshing, setRefreshing] = useState(false);

  // Load doctors on mount
  useEffect(() => {
    dispatch(fetchDoctors(filters));
  }, [dispatch, filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newFilters = { ...filters, search: query, page: 1 };
    setFilters(newFilters);
    dispatch(fetchDoctors(newFilters));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    try {
      await dispatch(fetchDoctors(filters));
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to refresh doctors:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.has_next && !loading) {
      const newFilters = { ...filters, page: pagination.page + 1 };
      setFilters(newFilters);
      dispatch(fetchDoctors(newFilters));
    }
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    hapticFeedback.light();
    onDoctorSelect?.(doctor);
  };

  // Handle add doctor
  const handleAddDoctor = () => {
    hapticFeedback.light();
    onAddDoctor?.();
  };

  // Clear error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  // Render doctor item
  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <Card
      style={{ marginBottom: 12 }}
      onPress={() => handleDoctorSelect(item)}
      {...getA11yProps(`Doctor: ${item.name}. Specialization: ${item.specialization}`)}
    >
      <AyskaTitleComponent level={3} weight="semibold" style={{ marginBottom: 8 }}>
        {item.name}
      </AyskaTitleComponent>
      <AyskaTextComponent variant="body" color="textSecondary" style={{ marginBottom: 4 }}>
        {item.specialization}
      </AyskaTextComponent>
      <AyskaTextComponent variant="bodySmall" color="textSecondary">
        {item.phone} • {item.email}
      </AyskaTextComponent>
      <AyskaTextComponent variant="bodySmall" color="textSecondary" style={{ marginTop: 4 }}>
        {item.location_address}
      </AyskaTextComponent>
    </Card>
  );

  // Render loading skeleton
  if (loading && doctors.length === 0) {
    return (
      <View style={style}>
        {[...Array(5)].map((_, i) => (
          <CardSkeleton key={i} variant="doctor" />
        ))}
      </View>
    );
  }

  // Render empty state
  if (!loading && doctors.length === 0) {
    return (
      <EmptyState
        title="No Doctors Found"
        message="No doctors match your current search criteria."
        actionLabel="Add Doctor"
        onAction={handleAddDoctor}
      />
    );
  }

  return (
    <ErrorBoundary>
      <AyskaTitleComponent level={2} weight="bold" style={{ marginBottom: 16 }}>
        Doctors ({pagination.total})
      </AyskaTitleComponent>

      {/* Search Input */}
      <Input
        placeholder="Search doctors..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={{ marginBottom: 16 }}
        {...getA11yProps('Search doctors by name, specialization, or contact')}
      />

      {/* Add Button */}
      {showAddButton && (
        <AyskaActionButtonComponent
          label="Add Doctor"
          variant="primary"
          onPress={handleAddDoctor}
          style={{ marginBottom: 16 }}
          {...getA11yProps('Add new doctor')}
        />
      )}

      {/* Doctors List */}
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ErrorBoundary>
  );
};
