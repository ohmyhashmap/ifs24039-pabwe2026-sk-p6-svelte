<script>
  import { onMount } from "svelte";
  import { Plus, Trash2, Search } from "lucide-svelte";
  import { linkTrees, loading, fetchLinkTrees, removeLinkTree, removeAllLinkTrees } from "../states/linkTreesStore.js";
  import { profile } from "../../auth/states/authStore.js";
  import { showConfirmDialog, showErrorDialog, showSuccessDialog, formatDate } from "../../../helpers/toolsHelper.js";
  import Link from "../../common/components/Link.svelte";
  import AddModal from "../modals/AddModal.svelte";

  let search = $state("");
  let onlyMine = $state(false);
  let showAdd = $state(false);

  onMount(fetchLinkTrees);

  const filtered = $derived(
    $linkTrees.filter(
      (l) => (l.title ?? "").toLowerCase().includes(search.toLowerCase()) && (!onlyMine || l.user_id === $profile?.id)
    )
  );
  const stats = $derived({
    total: $linkTrees.length,
    public: $linkTrees.filter((l) => l.type === "public").length,
    unlisted: $linkTrees.filter((l) => l.type === "unlisted").length,
    private: $linkTrees.filter((l) => l.type === "private").length,
  });

  async function remove(l) {
    if (!(await showConfirmDialog(`Hapus "${l.title}"?`))) return;
    const r = await removeLinkTree(l.id);
    if (r.ok) showSuccessDialog("Link tree dihapus");
    else showErrorDialog(r.message);
  }
  async function removeAll() {
    if (!(await showConfirmDialog("Hapus SEMUA link tree milikmu?"))) return;
    const r = await removeAllLinkTrees();
    if (r.ok) showSuccessDialog("Semua link tree dihapus");
    else showErrorDialog(r.message);
  }
</script>

<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
  <h1 class="text-2xl font-bold">Semua Link Tree</h1>
  <div class="flex gap-2">
    <button onclick={removeAll} class="px-3 py-2 rounded-lg border text-red-600 text-sm">Hapus Semua</button>
    <button onclick={() => (showAdd = true)} class="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-1">
      <Plus class="w-4 h-4" /> Tambah
    </button>
  </div>
</div>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
  {#each Object.entries(stats) as [k, v] (k)}
    <div class="bg-white rounded-xl p-3 shadow-sm"><p class="text-2xl font-bold">{v}</p><p class="text-xs capitalize text-slate-600">{k}</p></div>
  {/each}
</div>

<div class="flex flex-wrap gap-3 items-center mb-4">
  <div class="relative flex-1 min-w-48">
    <Search class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
    <input bind:value={search} placeholder="Cari judul..." class="w-full border rounded-lg pl-9 pr-3 py-2" />
  </div>
  <label class="text-sm flex items-center gap-2"><input type="checkbox" bind:checked={onlyMine} /> Milik saya</label>
</div>

{#if $loading}
  <p class="text-slate-600">Memuat...</p>
{:else if filtered.length === 0}
  <p class="text-slate-600">Tidak ada link tree.</p>
{:else}
  <ul class="grid gap-3 sm:grid-cols-2">
    {#each filtered as l (l.id)}
      <li class="bg-white rounded-xl shadow-sm overflow-hidden">
        {#if l.cover}<img src={l.cover} alt={l.title} class="h-28 w-full object-cover" />{/if}
        <div class="p-4">
          <div class="flex justify-between items-start">
            <Link href={`/link-trees/${l.id}`} class="font-semibold text-indigo-600">{l.title}</Link>
            {#if l.user_id === $profile?.id}
              <button onclick={() => remove(l)} aria-label="Hapus {l.title}" class="text-red-500"><Trash2 class="w-4 h-4" /></button>
            {/if}
          </div>
          <p class="text-sm text-slate-600 line-clamp-2">{l.description}</p>
          <p class="text-xs text-slate-600 mt-2">{`${l.type ?? "-"} • ${formatDate(l.created_at)}`}</p>
        </div>
      </li>
    {/each}
  </ul>
{/if}

{#if showAdd}<AddModal onclose={() => (showAdd = false)} />{/if}
