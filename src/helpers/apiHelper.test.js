import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch, getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper.js";

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

describe("apiHelper", () => {
  it("token", () => {
    putAccessToken("t");
    expect(getAccessToken()).toBe("t");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
  it("sukses + header Authorization", async () => {
    putAccessToken("t");
    const f = vi.fn().mockResolvedValue({ json: async () => ({ status: "success", data: { a: 1 } }) });
    vi.stubGlobal("fetch", f);
    const r = await apiFetch("/x", { method: "POST", body: { a: 1 } });
    expect(r.ok).toBe(true);
    expect(f.mock.calls[0][1].headers.Authorization).toBe("Bearer t");
  });
  it("form data & gagal jaringan", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ status: "fail", message: "m" }) }));
    expect((await apiFetch("/x", { form: new FormData() })).ok).toBe(false);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("x")));
    expect((await apiFetch("/x")).message).toMatch(/Gagal/);
  });
});
