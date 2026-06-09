import { useSyncExternalStore } from "react";

const subscribe = () => {
  return () => undefined;
};

const getClientSnapshot = () => true;

const getServerSnapshot = () => false;

export const useIsClient = () => {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
};

