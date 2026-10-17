import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { navigate, currentPath, resolveRoute } from "./router.js";

describe("router", () => {
  it("resolveRoute", () => {
    expect(resolveRoute("/auth/login").layout).toBe("auth");
    expect(resolveRoute("/auth/register").name).toBe("register");
    expect(resolveRoute("/").name).toBe("home");
    expect(resolveRoute("/users").name).toBe("users");
    expect(resolveRoute("/profile").name).toBe("profile");
    expect(resolveRoute("/link-trees/abc")).toMatchObject({ name: "detail", params: { linkTreeId: "abc" } });
    expect(resolveRoute("/xyz").name).toBe("notfound");
  });
  it("navigate", () => {
    navigate("/users");
    expect(get(currentPath)).toBe("/users");
    navigate("/", { replace: true });
    expect(window.location.pathname).toBe("/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/");
  });
});
