import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View as TamaguiView } from '@tamagui/core';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (_query: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  onFilterPress,
  showFilter = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <TamaguiView flexDirection="row" marginBottom="$md">
      <TamaguiView
        flex={1}
        flexDirection="row"
        alignItems="center"
        borderRadius="$md"
        borderWidth={1}
        paddingHorizontal="$md"
        height={48}
        backgroundColor="$card"
        borderColor="$border"
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={{
            flex: 1,
            height: '100%',
            fontSize: 16,
            color: theme.text,
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={handleChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={{ padding: 4 }}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </TamaguiView>
      {showFilter && onFilterPress && (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8,
            backgroundColor: '$card',
            borderColor: '$border',
          }}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      )}
    </TamaguiView>
  );
}
