import { Link } from 'expo-router';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';

export default function ModalScreen() {
  return (
    <TamaguiView
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$lg"
      backgroundColor="$background"
    >
      <TamaguiText
        fontSize="$8"
        fontWeight="700"
        color="$text"
        marginBottom="$lg"
      >
        This is a modal
      </TamaguiText>
      <Link href="/" dismissTo>
        <TamaguiView marginTop="$md" paddingVertical="$md">
          <TamaguiText fontSize="$4" color="$primary" fontWeight="600">
            Go to home screen
          </TamaguiText>
        </TamaguiView>
      </Link>
    </TamaguiView>
  );
}
