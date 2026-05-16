import { useEffect, useRef, useCallback } from "react";

export function usePolling(fetchFn, intervalMs = 30000, enabled = true) {
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  const refresh = useCallback(() => {
    if (enabled) return fetchRef.current();
    return Promise.resolve();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs, enabled]);

  return refresh;
}
