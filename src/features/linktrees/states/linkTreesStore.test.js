import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
vi.mock("../api/linkTreeApi.js", () => ({
  getLinkTreesApi: vi.fn(), getLinkTreeApi: vi.fn(), addLinkTreeApi: vi.fn(), updateLinkTreeApi: vi.fn(),
  updateCoverApi: vi.fn(), deleteLinkTreeApi: vi.fn(), deleteAllLinkTreesApi: vi.fn(),
  addItemApi: vi.fn(), updateItemApi: vi.fn(), deleteItemApi: vi.fn(),
}));
import * as api from "../api/linkTreeApi.js";
import * as s from "./linkTreesStore.js";

const ok = (data = {}) => ({ ok: true, data });
const fail = { ok: false, message: "gagal" };

beforeEach(() => {
  vi.clearAllMocks();
  s.linkTrees.set([]);
  s.linkTree.set(null);
  api.getLinkTreesApi.mockResolvedValue(ok({ link_trees: [{ id: 1 }] }));
  api.getLinkTreeApi.mockResolvedValue(ok({ link_tree: { id: 1 } }));
});

describe("linkTreesStore", () => {
  it("fetchLinkTrees sukses & gagal", async () => {
    await s.fetchLinkTrees();
    expect(get(s.linkTrees)).toEqual([{ id: 1 }]);
    expect(get(s.loading)).toBe(false);
    s.linkTrees.set([]);
    api.getLinkTreesApi.mockResolvedValue(fail);
    await s.fetchLinkTrees();
    expect(get(s.linkTrees)).toEqual([]);
  });
  it("fetchLinkTree sukses & gagal", async () => {
    await s.fetchLinkTree(1);
    expect(get(s.linkTree)).toEqual({ id: 1 });
    api.getLinkTreeApi.mockResolvedValue(fail);
    await s.fetchLinkTree(1);
    expect(get(s.linkTree)).toBeNull();
  });
  it("mutasi sukses memuat ulang data & mengatur bendera", async () => {
    const file = new File(["x"], "a.png");
    for (const call of ["addLinkTreeApi", "updateLinkTreeApi", "updateCoverApi", "deleteLinkTreeApi",
      "deleteAllLinkTreesApi", "addItemApi", "updateItemApi", "deleteItemApi"]) api[call].mockResolvedValue(ok());

    await s.addLinkTree({ title: "a" });
    expect(api.addLinkTreeApi).toHaveBeenCalledWith({ title: "a" });
    await s.changeLinkTree(1, { title: "b" });
    expect(api.updateLinkTreeApi).toHaveBeenCalledWith(1, { title: "b" });
    await s.changeCover(1, file);
    expect(api.updateCoverApi).toHaveBeenCalledWith(1, file);
    await s.removeLinkTree(1);
    expect(api.deleteLinkTreeApi).toHaveBeenCalledWith(1);
    await s.removeAllLinkTrees();
    expect(api.deleteAllLinkTreesApi).toHaveBeenCalled();
    await s.addItem(1, { title: "i" });
    expect(api.addItemApi).toHaveBeenCalledWith(1, { title: "i" });
    await s.changeItem(1, 2, { title: "j" });
    expect(api.updateItemApi).toHaveBeenCalledWith(1, 2, { title: "j" });
    await s.removeItem(1, 2);
    expect(api.deleteItemApi).toHaveBeenCalledWith(1, 2);

    expect(api.getLinkTreesApi).toHaveBeenCalledTimes(3);
    expect(api.getLinkTreeApi).toHaveBeenCalledTimes(5);
    expect(Object.values(get(s.flags)).every((v) => v === false)).toBe(true);
  });
  it("bendera aktif selama mutasi berjalan", async () => {
    let done;
    api.addLinkTreeApi.mockReturnValue(new Promise((r) => (done = r)));
    const p = s.addLinkTree({});
    expect(get(s.flags).add).toBe(true);
    done(fail);
    await p;
    expect(get(s.flags).add).toBe(false);
  });
  it("mutasi gagal tidak memuat ulang", async () => {
    api.deleteLinkTreeApi.mockResolvedValue(fail);
    const r = await s.removeLinkTree(1);
    expect(r.ok).toBe(false);
    expect(api.getLinkTreesApi).not.toHaveBeenCalled();
  });
});
