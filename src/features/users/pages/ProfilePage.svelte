<script>
  import { profile, loadProfile } from "../../auth/states/authStore.js";
  import { updateMeApi, updatePhotoApi, updatePasswordApi } from "../api/userApi.js";
  import { useInput } from "../../../hooks/useInput.js";
  import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

  const { value: name } = useInput($profile?.name ?? "");
  const { value: email } = useInput($profile?.email ?? "");
  const { value: oldPass, reset: resetOld } = useInput();
  const { value: newPass, reset: resetNew } = useInput();

  async function handle(promise, okText) {
    const r = await promise;
    if (r.ok) {
      await loadProfile();
      showSuccessDialog(okText);
    } else showErrorDialog(r.message);
    return r;
  }
  function saveData(e) {
    e.preventDefault();
    return handle(updateMeApi($name, $email), "Profil diperbarui");
  }
  function savePhoto(e) {
    const f = e.target.files[0];
    if (f) return handle(updatePhotoApi(f), "Foto diperbarui");
  }
  async function savePassword(e) {
    e.preventDefault();
    const r = await handle(updatePasswordApi($oldPass, $newPass), "Kata sandi diperbarui");
    if (r.ok) {
      resetOld();
      resetNew();
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">Profil</h1>
<div class="grid gap-6 md:grid-cols-2">
  <form onsubmit={saveData} class="bg-white rounded-xl p-5 shadow-sm space-y-3">
    {#if $profile?.photo}<img src={$profile.photo} alt="Foto profil" class="w-20 h-20 rounded-full object-cover" />{/if}
    <input type="file" accept="image/*" aria-label="Unggah foto profil" onchange={savePhoto} class="text-sm" />
    <input bind:value={$name} placeholder="Nama" required class="w-full border rounded-lg px-3 py-2" />
    <input type="email" bind:value={$email} placeholder="Email" required class="w-full border rounded-lg px-3 py-2" />
    <button class="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold">Simpan</button>
  </form>
  <form onsubmit={savePassword} class="bg-white rounded-xl p-5 shadow-sm space-y-3">
    <h2 class="font-semibold">Ubah kata sandi</h2>
    <input type="password" bind:value={$oldPass} placeholder="Kata sandi lama" required class="w-full border rounded-lg px-3 py-2" />
    <input type="password" bind:value={$newPass} placeholder="Kata sandi baru" required class="w-full border rounded-lg px-3 py-2" />
    <button class="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold">Ubah</button>
  </form>
</div>
