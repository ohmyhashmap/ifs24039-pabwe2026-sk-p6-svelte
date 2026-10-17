import { it, expect, vi } from "vitest";
vi.mock("../../../helpers/apiHelper.js", () => ({ apiFetch: vi.fn().mockResolvedValue({ ok: true }) }));
import { apiFetch } from "../../../helpers/apiHelper.js";
import { getUsersApi, getMeApi, updateMeApi, updatePhotoApi, updatePasswordApi } from "./userApi.js";

it("endpoint pengguna", async () => {
  await getUsersApi();
  expect(apiFetch).toHaveBeenLastCalledWith("/users");
  await getMeApi();
  expect(apiFetch).toHaveBeenLastCalledWith("/users/me");
  await updateMeApi("n", "e");
  expect(apiFetch).toHaveBeenLastCalledWith("/users/me", { method: "PUT", body: { name: "n", email: "e" } });
  await updatePasswordApi("o", "n");
  expect(apiFetch).toHaveBeenLastCalledWith("/users/me/password", { method: "PUT", body: { password: "o", new_password: "n" } });
});
it("updatePhotoApi mengirim FormData", async () => {
  await updatePhotoApi(new File(["x"], "a.png"));
  const [path, opt] = apiFetch.mock.calls.at(-1);
  expect(path).toBe("/users/me/photo");
  expect(opt.method).toBe("POST");
  expect(opt.form.get("photo").name).toBe("a.png");
});
