import React, { useState } from 'react';
import { Input as TamaguiInput } from '@tamagui/input';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaLabelComponent } from './AyskaLabelComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline,
  numberOfLines,
  error,
  style,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <TamaguiView style={style} marginBottom="$md">
      {label && (
        <AyskaLabelComponent style={{ marginBottom: 8 }}>
          {label}
        </AyskaLabelComponent>
      )}
      <TamaguiView
        borderColor={error ? '$error' : isFocused ? '$primary' : '$border'}
        backgroundColor="$card"
        borderWidth={1}
        borderRadius="$md"
        padding="$sm"
        flexDirection="row"
        alignItems="center"
      >
        {icon && <TamaguiView marginRight="$sm">{icon}</TamaguiView>}
        <TamaguiInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline || false}
          numberOfLines={numberOfLines || 1}
          color="$text"
          placeholderTextColor="$textSecondary"
          borderWidth={0}
          backgroundColor="transparent"
          flex={1}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
      </TamaguiView>
      {error && (
        <AyskaCaptionComponent color="error" style={{ marginTop: 4 }}>
          {error}
        </AyskaCaptionComponent>
      )}
    </TamaguiView>
  );
};
