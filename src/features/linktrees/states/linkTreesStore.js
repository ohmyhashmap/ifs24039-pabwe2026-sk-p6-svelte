import { writable } from "svelte/store";
import * as api from "../api/linkTreeApi.js";

export const linkTrees = writable([]);
export const linkTree = writable(null);
export const loading = writable(false);
// bendera mutasi
export const flags = writable({
  add: false, change: false, cover: false, remove: false, removeAll: false, item: false,
});

const setFlag = (key, v) => flags.update((f) => ({ ...f, [key]: v }));

export async function fetchLinkTrees() {
  loading.set(true);
  const r = await api.getLinkTreesApi();
  if (r.ok) linkTrees.set(r.data.link_trees);
  loading.set(false);
  return r;
}

export async function fetchLinkTree(id) {
  loading.set(true);
  const r = await api.getLinkTreeApi(id);
  linkTree.set(r.ok ? r.data.link_tree : null);
  loading.set(false);
  return r;
}

async function mutate(key, call, after) {
  setFlag(key, true);
  const r = await call();
  setFlag(key, false);
  if (r.ok) await after();
  return r;
}

export const addLinkTree = (body) => mutate("add", () => api.addLinkTreeApi(body), fetchLinkTrees);
export const changeLinkTree = (id, body) => mutate("change", () => api.updateLinkTreeApi(id, body), () => fetchLinkTree(id));
export const changeCover = (id, file) => mutate("cover", () => api.updateCoverApi(id, file), () => fetchLinkTree(id));
export const removeLinkTree = (id) => mutate("remove", () => api.deleteLinkTreeApi(id), fetchLinkTrees);
export const removeAllLinkTrees = () => mutate("removeAll", api.deleteAllLinkTreesApi, fetchLinkTrees);
export const addItem = (id, body) => mutate("item", () => api.addItemApi(id, body), () => fetchLinkTree(id));
export const changeItem = (id, itemId, body) => mutate("item", () => api.updateItemApi(id, itemId, body), () => fetchLinkTree(id));
export const removeItem = (id, itemId) => mutate("item", () => api.deleteItemApi(id, itemId), () => fetchLinkTree(id));
