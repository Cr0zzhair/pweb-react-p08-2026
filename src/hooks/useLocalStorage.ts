import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch {
      // Fallback to initialValue if localStorage is unavailable or corrupt
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore quota / storage errors gracefully
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
