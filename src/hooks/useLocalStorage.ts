import { useState, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const storedRef = useRef(stored);
  storedRef.current = stored;

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedRef.current) : value;
      setStored(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch { /* silently fail */ }
  }, [key]);

  return [stored, setValue] as const;
}

export function useRecentlyUsed() {
  const [recent, setRecent] = useLocalStorage<string[]>('sulitnow-recent', []);

  const addRecent = useCallback((toolId: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 10);
    });
  }, [setRecent]);

  return { recent, addRecent };
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('sulitnow-favorites', []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      if (prev.includes(toolId)) return prev.filter((id) => id !== toolId);
      return [...prev, toolId];
    });
  }, [setFavorites]);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
