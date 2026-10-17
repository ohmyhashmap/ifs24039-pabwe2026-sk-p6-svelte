import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { profile } from "./features/auth/states/authStore.js";
import { linkTrees, linkTree, loading, flags } from "./features/linktrees/states/linkTreesStore.js";

/** Snippet sederhana untuk prop `children`. */
export const snippet = (html = "<span>isi</span>") => createRawSnippet(() => ({ render: () => html }));

/** Render komponen Svelte dengan state store awal. */
export function renderWithProviders(Component, { props = {}, stores = {} } = {}) {
  profile.set(stores.profile ?? null);
  linkTrees.set(stores.linkTrees ?? []);
  linkTree.set(stores.linkTree ?? null);
  loading.set(stores.loading ?? false);
  flags.set({ add: false, change: false, cover: false, remove: false, removeAll: false, item: false, ...stores.flags });
  return render(Component, { props });
}
