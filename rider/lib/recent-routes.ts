/** Local-first route history and bookmarks; account sync can replace this adapter later. */

const STORAGE_KEY = "transitos.recent-routes";
const BOOKMARK_KEY = "transitos.bookmarked-routes";
const ROUTE_LIBRARY_EVENT = "transitos:route-library";
const MAX_RECENT = 5;

export function readRecentRouteIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is number => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

export function rememberRouteIds(routeIds: number[]): number[] {
  const merged = [...routeIds, ...readRecentRouteIds()];
  const recent = [...new Set(merged)].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  return recent;
}

export function readBookmarkedRouteIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BOOKMARK_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is number => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkedRoute(routeId: number): number[] {
  const current = readBookmarkedRouteIds();
  const next = current.includes(routeId) ? current.filter((id) => id !== routeId) : [routeId, ...current];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(ROUTE_LIBRARY_EVENT));
  return next;
}

export function subscribeToRouteLibrary(listener: () => void): () => void {
  window.addEventListener(ROUTE_LIBRARY_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(ROUTE_LIBRARY_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
