import { it, expect, vi } from "vitest";
vi.mock("../../../helpers/apiHelper.js", () => ({ apiFetch: vi.fn().mockResolvedValue({ ok: true }) }));
import { apiFetch } from "../../../helpers/apiHelper.js";
import * as api from "./linkTreeApi.js";

it("endpoint link tree", async () => {
  await api.getLinkTreesApi();
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees");
  await api.getLinkTreeApi(1);
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees/1");
  await api.addLinkTreeApi({ a: 1 });
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees", { method: "POST", body: { a: 1 } });
  await api.updateLinkTreeApi(1, { a: 2 });
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees/1", { method: "PUT", body: { a: 2 } });
  await api.deleteLinkTreeApi(1);
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees/1", { method: "DELETE" });
  await api.deleteAllLinkTreesApi();
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees", { method: "DELETE" });
});
it("endpoint item", async () => {
  await api.addItemApi(1, { t: 1 });
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees/1/items", { method: "POST", body: { t: 1 } });
  await api.updateItemApi(1, 2, { t: 2 });
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees/1/items/2", { method: "PUT", body: { t: 2 } });
  await api.deleteItemApi(1, 2);
  expect(apiFetch).toHaveBeenLastCalledWith("/link-trees/1/items/2", { method: "DELETE" });
});
it("updateCoverApi mengirim FormData", async () => {
  await api.updateCoverApi(1, new File(["x"], "c.png"));
  const [path, opt] = apiFetch.mock.calls.at(-1);
  expect(path).toBe("/link-trees/1/cover");
  expect(opt.form.get("cover").name).toBe("c.png");
});
