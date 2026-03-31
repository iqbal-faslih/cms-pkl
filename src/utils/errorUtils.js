let listeners = [];
let lastError = null;
let lastTimestamp = 0;

const ERROR_COOLDOWN = 3000;

export const emitError = (message) => {
  const now = Date.now();
  if (message === lastError && now - lastTimestamp < ERROR_COOLDOWN) {
    return;
  }

  lastError = message;
  lastTimestamp = now;

  listeners.forEach((listener) => listener(message));
};

export const subscribeError = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};
