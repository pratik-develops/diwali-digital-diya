import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type SetStateAction,
} from "react";

const STORAGE_EVENT = "diya-storage-change";

function subscribeToStorage(key: string, callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) callback();
  };
  const onLocalChange = (event: Event) => {
    if ((event as CustomEvent<string>).detail === key) callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_EVENT, onLocalChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_EVENT, onLocalChange);
  };
}

function getSnapshot(key: string, fallback: string) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode — ignore so the UI still works for the session.
  }
}

export function useStoredJson<T>(
  key: string,
  fallback: T,
): [T, (next: SetStateAction<T>) => void] {
  const fallbackSnapshot = JSON.stringify(fallback);
  const subscribe = useCallback(
    (callback: () => void) => subscribeToStorage(key, callback),
    [key],
  );
  const readSnapshot = useCallback(
    () => getSnapshot(key, fallbackSnapshot),
    [key, fallbackSnapshot],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => fallbackSnapshot,
  );
  const value = useMemo(() => {
    try {
      return JSON.parse(snapshot) as T;
    } catch {
      return fallback;
    }
  }, [fallback, snapshot]);

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      let current = fallback;
      try {
        const saved = window.localStorage.getItem(key);
        if (saved) current = JSON.parse(saved) as T;
      } catch {
        current = value;
      }

      const updated =
        typeof next === "function"
          ? (next as (previous: T) => T)(current)
          : next;
      writeJson(key, updated);
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
    },
    [fallback, key, value],
  );

  return [value, setValue];
}
