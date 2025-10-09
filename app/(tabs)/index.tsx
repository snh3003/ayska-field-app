import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import EmployeeHome from '../../src/screens/Employee/EmployeeHome';
import AdminDashboard from '../../src/screens/Admin/AdminDashboard';
import type { RootState } from '../../src/store';

export default function HomeScreen() {
  const { role, userId } = useSelector((s: RootState) => s.auth);

  if (!userId) {
    return <Redirect href="/login" />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'employee') {
    return <EmployeeHome />;
  }

  return <Redirect href="/login" />;
}
