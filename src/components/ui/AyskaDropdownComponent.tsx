import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
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
            <TamaguiText
              fontSize="$4"
              color={isSelected ? theme.primary : theme.text}
              fontWeight={isSelected ? '600' : '400'}
            >
              {item.name}
            </TamaguiText>
            {item.subtitle && (
              <TamaguiText
                fontSize="$3"
                color={theme.textSecondary}
                marginTop="$xs"
              >
                {item.subtitle}
              </TamaguiText>
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
      <TamaguiText
        fontSize="$4"
        color={theme.textSecondary}
        marginTop="$sm"
        textAlign="center"
      >
        {searchQuery ? 'No items found' : 'No items available'}
      </TamaguiText>
      {searchQuery && (
        <TamaguiText
          fontSize="$3"
          color={theme.textSecondary}
          marginTop="$xs"
          textAlign="center"
        >
          Try adjusting your search
        </TamaguiText>
      )}
    </TamaguiView>
  );

  return (
    <TamaguiView marginBottom="$md">
      {label && (
        <TamaguiText
          fontSize="$4"
          color="$text"
          marginBottom="$sm"
          fontWeight="600"
        >
          {label}
        </TamaguiText>
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
          <TamaguiText
            fontSize="$4"
            color={selectedItem ? theme.text : theme.textSecondary}
            numberOfLines={1}
          >
            {displayText}
          </TamaguiText>
        </TamaguiView>

        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      {error && (
        <TamaguiText fontSize="$3" color="$error" marginTop="$xs">
          {error}
        </TamaguiText>
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
