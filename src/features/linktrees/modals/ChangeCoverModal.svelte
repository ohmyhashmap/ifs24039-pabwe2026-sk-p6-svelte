<script>
  import Modal from "../components/Modal.svelte";
  import { changeCover, flags } from "../states/linkTreesStore.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";

  let { linkTree, onclose } = $props();
  let file = $state(null);

  async function submit(e) {
    e.preventDefault();
    if (!file) return showErrorDialog("Pilih berkas sampul terlebih dahulu");
    const r = await changeCover(linkTree.id, file);
    if (r.ok) onclose();
    else showErrorDialog(r.message);
  }
</script>

<Modal title="Ubah Sampul" {onclose} onsubmit={submit} busy={$flags.cover}>
  <input type="file" accept="image/*" aria-label="Pilih berkas sampul" onchange={(e) => (file = e.target.files[0])} />
</Modal>
