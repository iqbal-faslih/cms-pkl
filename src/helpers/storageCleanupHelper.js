const snapshotStorageValues = (storage, keys = []) =>
  keys.reduce((acc, key) => {
    const value = storage.getItem(key);
    if (value !== null) acc[key] = value;
    return acc;
  }, {});

const restoreStorageValues = (storage, values = {}) => {
  Object.entries(values).forEach(([key, value]) => {
    storage.setItem(key, value);
  });
};

export const clearBrowserStoragePreserving = (keysToPreserve = []) => {
  if (typeof window === "undefined") return;

  const localSnapshot = snapshotStorageValues(window.localStorage, keysToPreserve);
  const sessionSnapshot = snapshotStorageValues(window.sessionStorage, keysToPreserve);

  window.localStorage.clear();
  window.sessionStorage.clear();

  restoreStorageValues(window.localStorage, localSnapshot);
  restoreStorageValues(window.sessionStorage, sessionSnapshot);
};
