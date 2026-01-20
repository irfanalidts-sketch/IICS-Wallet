//home/irfan/RW/app/core/BalanceRefresh.ts
type Listener = () => void;

let listeners: Listener[] = [];

export const notifyBalanceRefresh = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeBalanceRefresh = (listener: Listener) => {
  listeners.push(listener);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};
