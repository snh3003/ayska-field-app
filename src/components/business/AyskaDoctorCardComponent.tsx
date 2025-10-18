import React from 'react';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { AyskaStackComponent } from '../ui/AyskaStackComponent';
import { useTheme } from '../../../utils/theme';
import type { Doctor } from '../../types';

export const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
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
        {doctor.name}
      </AyskaTextComponent>
      <AyskaTextComponent color="text">
        {doctor.specialization}
      </AyskaTextComponent>
      <AyskaCaptionComponent color="textSecondary">
        Loc: {doctor.location.lat}, {doctor.location.lng}
      </AyskaCaptionComponent>
    </AyskaStackComponent>
  );
};
