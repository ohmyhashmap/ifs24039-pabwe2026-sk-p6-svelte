<script>
  import { onMount } from "svelte";
  import { getUsersApi } from "../api/userApi.js";
  let users = $state([]);
  onMount(async () => {
    const r = await getUsersApi();
    if (r.ok) users = r.data.users;
  });
</script>

<h1 class="text-2xl font-bold mb-4">Pengguna</h1>
<ul class="grid gap-3 sm:grid-cols-2">
  {#each users as u (u.id)}
    <li class="bg-white rounded-xl p-4 shadow-sm">
      <p class="font-semibold">{u.name}</p>
      <p class="text-sm text-slate-600">{u.email}</p>
    </li>
  {/each}
</ul>
