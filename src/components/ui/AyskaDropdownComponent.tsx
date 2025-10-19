import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaLabelComponent } from './AyskaLabelComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaTextComponent } from './AyskaTextComponent';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../navigation/AyskaBottomSheetComponent';
import { Input } from './AyskaInputComponent';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { hapticFeedback } from '../../../utils/haptics';

export interface DropdownItem {
  id: string;
  name: string;
  subtitle?: string;
}

export interface DropdownProps {
  label: string;
  placeholder: string;
  value: string;
  items: DropdownItem[];
  onSelect: (_id: string) => void;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  value,
  items,
  onSelect,
  icon,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const selectedItem = items.find(item => item.id === value);
  const displayText = selectedItem ? selectedItem.name : placeholder;
  const showSearch = items.length > 10;

  const filteredItems = showSearch
    ? items.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.subtitle &&
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items;

  const handleOpen = () => {
    if (disabled) return;
    hapticFeedback.light();
    setIsOpen(true);
  };

  const handleClose = () => {
    hapticFeedback.light();
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelect = (item: DropdownItem) => {
    hapticFeedback.success();
    onSelect(item.id);
    handleClose();
  };

  const renderItem = ({ item }: { item: DropdownItem }) => {
    const isSelected = item.id === value;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: isSelected ? theme.background : 'transparent',
        }}
        accessibilityLabel={`Select ${item.name}`}
        accessibilityHint="Double tap to select this item"
      >
        <TamaguiView
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <TamaguiView flex={1}>
            <AyskaTextComponent
              color={isSelected ? 'primary' : 'text'}
              weight={isSelected ? 'semibold' : 'normal'}
            >
              {item.name}
            </AyskaTextComponent>
            {item.subtitle && (
              <AyskaCaptionComponent
                color="textSecondary"
                style={{ marginTop: 4 }}
              >
                {item.subtitle}
              </AyskaCaptionComponent>
            )}
          </TamaguiView>
          {isSelected && (
            <Ionicons name="checkmark" size={20} color={theme.primary} />
          )}
        </TamaguiView>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <TamaguiView
      alignItems="center"
      padding="$lg"
      justifyContent="center"
      minHeight={200}
    >
      <Ionicons name="list-outline" size={48} color={theme.textSecondary} />
      <AyskaTextComponent
        color="textSecondary"
        align="center"
        style={{ marginTop: 8 }}
      >
        {searchQuery ? 'No items found' : 'No items available'}
      </AyskaTextComponent>
      {searchQuery && (
        <AyskaCaptionComponent
          color="textSecondary"
          align="center"
          style={{ marginTop: 4 }}
        >
          Try adjusting your search
        </AyskaCaptionComponent>
      )}
    </TamaguiView>
  );

  return (
    <TamaguiView marginBottom="$md">
      {label && (
        <AyskaLabelComponent style={{ marginBottom: 8 }}>
          {label}
        </AyskaLabelComponent>
      )}

      <TouchableOpacity
        onPress={handleOpen}
        disabled={disabled}
        style={{
          borderColor: error ? theme.error : theme.border,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
        }}
        accessibilityLabel={`${label}: ${displayText}`}
        accessibilityHint="Double tap to open selection list"
      >
        {icon && <TamaguiView marginRight="$sm">{icon}</TamaguiView>}

        <TamaguiView flex={1}>
          <AyskaTextComponent
            color={selectedItem ? 'text' : 'textSecondary'}
            numberOfLines={1}
          >
            {displayText}
          </AyskaTextComponent>
        </TamaguiView>

        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      {error && (
        <AyskaCaptionComponent color="error" style={{ marginTop: 4 }}>
          {error}
        </AyskaCaptionComponent>
      )}

      <BottomSheet
        isVisible={isOpen}
        onClose={handleClose}
        title={label}
        height={Math.min(600, 200 + filteredItems.length * 60)}
      >
        <TamaguiView style={{ backgroundColor: theme.background }}>
          {showSearch && (
            <TamaguiView
              padding="$md"
              borderBottomWidth={1}
              borderBottomColor="$border"
            >
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                icon={
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                }
              />
            </TamaguiView>
          )}

          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </TamaguiView>
      </BottomSheet>
    </TamaguiView>
  );
};
