"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const browserSnapshot = () => window.location.href;
const serverSnapshot = () => "";

// Keep SSR and the first hydration render identical, then expose the URL.
export function useBrowserUrl() {
  return useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);
}
