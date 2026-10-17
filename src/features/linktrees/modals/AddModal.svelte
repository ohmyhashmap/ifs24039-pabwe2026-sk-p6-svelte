<script>
  import Modal from "../components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { addLinkTree, flags } from "../states/linkTreesStore.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";

  let { onclose } = $props();
  const { value: title } = useInput();
  const { value: description } = useInput();
  const { value: type } = useInput("public");

  async function submit(e) {
    e.preventDefault();
    const r = await addLinkTree({ title: $title, description: $description, type: $type });
    if (r.ok) onclose();
    else showErrorDialog(r.message);
  }
</script>

<Modal title="Tambah Link Tree" {onclose} onsubmit={submit} busy={$flags.add}>
  <input bind:value={$title} placeholder="Judul" required class="w-full border rounded-lg px-3 py-2" />
  <textarea bind:value={$description} placeholder="Deskripsi" required class="w-full border rounded-lg px-3 py-2"></textarea>
  <select aria-label="Tipe link tree" bind:value={$type} class="w-full border rounded-lg px-3 py-2">
    <option value="public">Public</option>
    <option value="unlisted">Unlisted</option>
    <option value="private">Private</option>
  </select>
</Modal>
