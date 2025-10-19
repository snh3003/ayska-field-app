import React from 'react';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { AyskaStackComponent } from '../ui/AyskaStackComponent';
import { useTheme } from '../../../utils/theme';

export const EmployeeCard: React.FC<{ name: string; email: string }> = ({
  name,
  email,
}) => {
  const theme = useTheme();

  return (
    <AyskaStackComponent
      direction="vertical"
      spacing="xs"
      padding="sm"
      backgroundColor="card"
      borderRadius="md"
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 8,
      }}
    >
      <AyskaTextComponent weight="semibold" color="text">
        {name}
      </AyskaTextComponent>
      <AyskaCaptionComponent color="textSecondary">
        {email}
      </AyskaCaptionComponent>
    </AyskaStackComponent>
  );
};
