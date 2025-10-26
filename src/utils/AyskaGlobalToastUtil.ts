// Global Toast Manager - Allows showing toasts from non-React contexts (interceptors, services)
// This bridges the gap between React Context and non-React code

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastFunction {
  (_message: string, _type?: ToastType, _duration?: number): void;
}

class GlobalToastManager {
  private toastCallback: ToastFunction | null = null;

  /**
   * Register toast callback from React context
   * Called once during app initialization
   */
  setToastCallback(callback: ToastFunction): void {
    this.toastCallback = callback;
  }

  /**
   * Show toast from anywhere in the app
   * Safe to call even if toast callback not registered yet
   */
  showToast(message: string, type: ToastType = 'error', duration = 10000): void {
    if (this.toastCallback) {
      this.toastCallback(message, type, duration);
    } else {
      // Fallback to console if toast not available yet
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('Toast not available:', { message, type });
      }
    }
  }

  /**
   * Convenience methods
   */
  success(message: string, duration?: number): void {
    this.showToast(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.showToast(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.showToast(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.showToast(message, 'warning', duration);
  }
}

// Singleton instance
export const globalToast = new GlobalToastManager();
