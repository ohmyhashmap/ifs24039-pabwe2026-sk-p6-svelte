import { writable } from "svelte/store";

export const currentPath = writable(globalThis.location.pathname);

export function navigate(path, { replace = false } = {}) {
  globalThis.history[replace ? "replaceState" : "pushState"]({}, "", path);
  currentPath.set(path);
}

globalThis.addEventListener("popstate", () => currentPath.set(globalThis.location.pathname));

export function resolveRoute(path) {
  if (path === "/auth/login") return { name: "login", layout: "auth", params: {} };
  if (path === "/auth/register") return { name: "register", layout: "auth", params: {} };
  if (path === "/") return { name: "home", layout: "app", params: {} };
  if (path === "/users") return { name: "users", layout: "app", params: {} };
  if (path === "/profile") return { name: "profile", layout: "app", params: {} };
  const m = path.match(/^\/link-trees\/([^/]+)\/?$/);
  if (m) return { name: "detail", layout: "app", params: { linkTreeId: m[1] } };
  return { name: "notfound", layout: "app", params: {} };
}
