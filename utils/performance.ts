import React, { useCallback, useEffect, useRef } from 'react';

/**
 * Debounce hook - delays execution until user stops typing/interacting
 */
export function useDebounce<T extends (..._args: any[]) => any>(
  callback: T,
  delay: number
): (..._args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay) as any;
    },
    [callback, delay]
  );
}

/**
 * Throttle hook - limits execution rate
 */
export function useThrottle<T extends (..._args: any[]) => any>(
  callback: T,
  delay: number
): (..._args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  );
}

/**
 * Memoize expensive calculations
 */
export function useMemoizedValue<T>(
  calculateValue: () => T,
  dependencies: any[]
): T {
  const memoizedValueRef = useRef<T | null>(null);
  const dependenciesRef = useRef<any[] | null>(null);

  const hasChanged =
    !dependenciesRef.current ||
    dependencies.some((dep, i) => dep !== dependenciesRef.current![i]);

  if (hasChanged) {
    memoizedValueRef.current = calculateValue();
    dependenciesRef.current = dependencies;
  }

  return memoizedValueRef.current as T;
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUri(
  uri: string,
  _width?: number,
  _height?: number
): string {
  // In production, you'd use a CDN service like Cloudinary or imgix
  // For now, we'll just return the original URI
  return uri;
}

/**
 * Lazy loading helper for heavy components
 */
export function useLazyLoad(delay = 100) {
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldLoad;
}

/**
 * Track component render performance
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
}

/**
 * Measure component render time
 */
export function useRenderTime(componentName: string) {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      if (startTime.current && __DEV__) {
        const renderTime = performance.now() - startTime.current;
        // eslint-disable-next-line no-console
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}
