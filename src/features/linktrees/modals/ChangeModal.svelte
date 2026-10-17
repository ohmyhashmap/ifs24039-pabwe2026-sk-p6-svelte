<script>
  import Modal from "../components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { changeLinkTree, flags } from "../states/linkTreesStore.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";

  let { linkTree, onclose } = $props();
  const { value: title } = useInput(linkTree.title);
  const { value: description } = useInput(linkTree.description);
  const { value: type } = useInput(linkTree.type);

  async function submit(e) {
    e.preventDefault();
    const r = await changeLinkTree(linkTree.id, { title: $title, description: $description, type: $type });
    if (r.ok) onclose();
    else showErrorDialog(r.message);
  }
</script>

<Modal title="Ubah Link Tree" {onclose} onsubmit={submit} busy={$flags.change}>
  <input bind:value={$title} required class="w-full border rounded-lg px-3 py-2" />
  <textarea bind:value={$description} required class="w-full border rounded-lg px-3 py-2"></textarea>
  <select aria-label="Tipe link tree" bind:value={$type} class="w-full border rounded-lg px-3 py-2">
    <option value="public">Public</option>
    <option value="unlisted">Unlisted</option>
    <option value="private">Private</option>
  </select>
</Modal>
