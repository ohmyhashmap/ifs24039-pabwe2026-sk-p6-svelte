import { it, expect, vi } from "vitest";
vi.mock("../../../helpers/apiHelper.js", () => ({ apiFetch: vi.fn().mockResolvedValue({ ok: true }) }));
import { apiFetch } from "../../../helpers/apiHelper.js";
import { loginApi, registerApi } from "./authApi.js";

it("loginApi", async () => {
  await loginApi("e", "p");
  expect(apiFetch).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { email: "e", password: "p" } });
});
it("registerApi", async () => {
  await registerApi("n", "e", "p");
  expect(apiFetch).toHaveBeenCalledWith("/auth/register", { method: "POST", body: { name: "n", email: "e", password: "p" } });
});
