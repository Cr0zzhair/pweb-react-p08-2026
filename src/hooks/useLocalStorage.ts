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
    } catch (error: unknown) {
      console.error(`Gagal membaca localStorage untuk "${key}".`, error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error: unknown) {
      console.error(`Gagal menyimpan localStorage untuk "${key}".`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
