import { writable } from "svelte/store";

export const currentPath = writable(window.location.pathname);

export function navigate(path, { replace = false } = {}) {
  window.history[replace ? "replaceState" : "pushState"]({}, "", path);
  currentPath.set(path);
}

window.addEventListener("popstate", () => currentPath.set(window.location.pathname));

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
