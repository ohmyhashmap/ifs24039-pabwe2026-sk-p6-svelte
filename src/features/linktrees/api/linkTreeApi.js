import { apiFetch } from "../../../helpers/apiHelper.js";

export const getLinkTreesApi = () => apiFetch("/link-trees");
export const getLinkTreeApi = (id) => apiFetch(`/link-trees/${id}`);
export const addLinkTreeApi = (body) => apiFetch("/link-trees", { method: "POST", body });
export const updateLinkTreeApi = (id, body) => apiFetch(`/link-trees/${id}`, { method: "PUT", body });
export const updateCoverApi = (id, file) => {
  const form = new FormData();
  form.append("cover", file);
  return apiFetch(`/link-trees/${id}/cover`, { method: "POST", form });
};
export const deleteLinkTreeApi = (id) => apiFetch(`/link-trees/${id}`, { method: "DELETE" });
export const deleteAllLinkTreesApi = () => apiFetch("/link-trees", { method: "DELETE" });
export const addItemApi = (id, body) => apiFetch(`/link-trees/${id}/items`, { method: "POST", body });
export const updateItemApi = (id, itemId, body) =>
  apiFetch(`/link-trees/${id}/items/${itemId}`, { method: "PUT", body });
export const deleteItemApi = (id, itemId) => apiFetch(`/link-trees/${id}/items/${itemId}`, { method: "DELETE" });
