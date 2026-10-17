<script>
  import { Link2, LogOut } from "lucide-svelte";
  import { profile, logout } from "../../auth/states/authStore.js";
  import Link from "../../common/components/Link.svelte";
</script>

<header class="bg-white border-b px-4 h-14 flex items-center justify-between">
  <Link href="/" class="flex items-center gap-2 font-extrabold text-indigo-600">
    <Link2 class="w-5 h-5" /> Delcom Link Tree
  </Link>
  <div class="flex items-center gap-3 text-sm">
    <span>{$profile?.name}</span>
    <button onclick={logout} aria-label="Keluar" class="text-slate-600"><LogOut class="w-5 h-5" /></button>
  </div>
</header>
