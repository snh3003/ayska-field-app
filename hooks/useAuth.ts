import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import type { RootState } from '../src/store';
import { logout as logoutAction } from '../src/store/slices/AyskaAuthSliceSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const logout = () => {
    dispatch(logoutAction() as any);
    router.replace('/login');
  };

  const isAuthenticated = !!auth.userId;
  const isAdmin = auth.role === 'admin';
  const isEmployee = auth.role === 'employee';

  return {
    user: {
      id: auth.userId,
      name: auth.name,
      email: auth.userId, // Assuming userId is email for now
      role: auth.role,
    },
    isAuthenticated,
    isAdmin,
    isEmployee,
    isLoading: auth.loading,
    error: auth.error,
    logout,
  };
}
