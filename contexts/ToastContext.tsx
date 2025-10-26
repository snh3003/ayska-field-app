import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Toast } from '../src/components/feedback/AyskaToastComponent';
import { globalToast } from '../src/utils/AyskaGlobalToastUtil';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (_message: string, _type?: ToastType, _duration?: number) => void;
  success: (_message: string, _duration?: number) => void;
  error: (_message: string, _duration?: number) => void;
  info: (_message: string, _duration?: number) => void;
  warning: (_message: string, _duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Counter to ensure unique IDs for rapid successive toasts
let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 10000) => {
    // Use timestamp + counter for guaranteed unique IDs
    const id = Date.now() + toastCounter++;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  // Register toast callback with global toast manager on mount
  useEffect(() => {
    globalToast.setToastCallback(showToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) => showToast(message, 'success', duration);
  const error = (message: string, duration?: number) => showToast(message, 'error', duration);
  const info = (message: string, duration?: number) => showToast(message, 'info', duration);
  const warning = (message: string, duration?: number) => showToast(message, 'warning', duration);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 3000}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
