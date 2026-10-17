<script>
  import Modal from "../components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { addItem, changeItem, flags } from "../states/linkTreesStore.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";

  // item === null -> mode tambah, selain itu mode ubah
  let { linkTreeId, item = null, onclose } = $props();
  const { value: title } = useInput(item?.title ?? "");
  const { value: url } = useInput(item?.url ?? "");

  async function submit(e) {
    e.preventDefault();
    const body = { title: $title, url: $url };
    const r = item ? await changeItem(linkTreeId, item.id, body) : await addItem(linkTreeId, body);
    if (r.ok) onclose();
    else showErrorDialog(r.message);
  }
</script>

<Modal title={item ? "Ubah Tautan" : "Tambah Tautan"} {onclose} onsubmit={submit} busy={$flags.item}>
  <input bind:value={$title} placeholder="Judul tautan" required class="w-full border rounded-lg px-3 py-2" />
  <input type="url" bind:value={$url} placeholder="https://..." required class="w-full border rounded-lg px-3 py-2" />
</Modal>
