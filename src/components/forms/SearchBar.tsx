import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [query, setQuery] = useState('');

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[Typography.body, styles.input, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={handleChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {showFilter && onFilterPress && (
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  clearButton: {
    padding: Spacing.xs,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
});
