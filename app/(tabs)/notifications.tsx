import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import NotificationsScreen from '../../src/screens/AyskaNotificationsScreenScreen';
import type { RootState } from '../../src/store';

export default function NotificationsTab() {
  const { userId } = useSelector((s: RootState) => s.auth);

  if (!userId) {
    return <Redirect href="/login" />;
  }

  return <NotificationsScreen />;
}
