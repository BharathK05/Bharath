import { useCallback, useSyncExternalStore } from 'react';

/**
 * Reactive `matchMedia`. Uses `useSyncExternalStore` because a media query is
 * exactly that — external state React needs to stay in sync with.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // Server render has no viewport; assume the wide layout.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
