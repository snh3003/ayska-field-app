import { ComponentProps } from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

type Props = Omit<ComponentProps<typeof TouchableOpacity>, 'onPress'> & {
  onPress?: () => void;
};

export function HapticTab({ onPress, ...props }: Props) {
  return (
    <TouchableOpacity
      {...props}
      onPress={(ev) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(ev);
      }}
    />
  );
}
