<script>
  import { onMount } from "svelte";
  import { Pencil, Trash2, Plus, ExternalLink, Image } from "lucide-svelte";
  import { linkTree, loading, fetchLinkTree, removeItem } from "../states/linkTreesStore.js";
  import { profile } from "../../auth/states/authStore.js";
  import { showConfirmDialog, showErrorDialog } from "../../../helpers/toolsHelper.js";
  import Link from "../../common/components/Link.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";

  let { params } = $props();
  let modal = $state(null); // "change" | "cover" | "item"
  let editing = $state(null);

  onMount(() => fetchLinkTree(params.linkTreeId));

  const isOwner = $derived($linkTree && $linkTree.user_id === $profile?.id);
  function close() {
    modal = null;
    editing = null;
  }
  function openItem(item = null) {
    editing = item;
    modal = "item";
  }
  async function del(item) {
    if (!(await showConfirmDialog(`Hapus tautan "${item.title}"?`))) return;
    const r = await removeItem($linkTree.id, item.id);
    if (!r.ok) showErrorDialog(r.message);
  }
</script>

{#if $loading}
  <p class="text-slate-600">Memuat...</p>
{:else if !$linkTree}
  <p class="text-slate-600">Link tree tidak ditemukan. <Link href="/" class="text-indigo-600">Kembali</Link></p>
{:else}
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    {#if $linkTree.cover}<img src={$linkTree.cover} alt={$linkTree.title} class="h-44 w-full object-cover" />{/if}
    <div class="p-5">
      <div class="flex flex-wrap justify-between gap-2">
        <h1 class="text-2xl font-bold">{$linkTree.title}</h1>
        {#if isOwner}
          <div class="flex gap-2 text-sm">
            <button onclick={() => (modal = "cover")} class="px-3 py-1.5 border rounded-lg flex items-center gap-1"><Image class="w-4 h-4" /> Sampul</button>
            <button onclick={() => (modal = "change")} class="px-3 py-1.5 border rounded-lg flex items-center gap-1"><Pencil class="w-4 h-4" /> Ubah</button>
          </div>
        {/if}
      </div>
      <p class="text-slate-600 mt-1">{$linkTree.description}</p>
      <p class="text-xs text-slate-600 mt-1">{$linkTree.type}</p>
    </div>
  </div>

  <div class="flex justify-between items-center mt-6 mb-3">
    <h2 class="font-bold">Tautan</h2>
    {#if isOwner}
      <button onclick={() => openItem()} class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-1"><Plus class="w-4 h-4" /> Tambah</button>
    {/if}
  </div>
  <ul class="space-y-2">
    {#each $linkTree.items ?? [] as item (item.id)}
      <li class="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
        <a href={item.url} target="_blank" rel="noreferrer" class="flex items-center gap-2 text-indigo-600 font-medium">
          <ExternalLink class="w-4 h-4" /> {item.title}
        </a>
        {#if isOwner}
          <div class="flex gap-2">
            <button onclick={() => openItem(item)} aria-label="Ubah {item.title}"><Pencil class="w-4 h-4" /></button>
            <button onclick={() => del(item)} aria-label="Hapus {item.title}" class="text-red-500"><Trash2 class="w-4 h-4" /></button>
          </div>
        {/if}
      </li>
    {:else}
      <li class="text-slate-600 text-sm">Belum ada tautan.</li>
    {/each}
  </ul>

  {#if modal === "change"}<ChangeModal linkTree={$linkTree} onclose={close} />{/if}
  {#if modal === "cover"}<ChangeCoverModal linkTree={$linkTree} onclose={close} />{/if}
  {#if modal === "item"}<ItemModal linkTreeId={$linkTree.id} item={editing} onclose={close} />{/if}
{/if}
