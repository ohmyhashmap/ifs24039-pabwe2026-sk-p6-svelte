<script>
  import { currentPath } from "../../../router.js";
  import Link from "../../common/components/Link.svelte";
  const menus = [
    { href: "/", label: "Semua Link Tree" },
    { href: "/users", label: "Pengguna" },
    { href: "/profile", label: "Profil" },
  ];
</script>

<nav class="w-52 shrink-0 bg-white border-r p-3 space-y-1 hidden sm:block">
  {#each menus as m (m.href)}
    <Link href={m.href} class="block rounded-lg px-3 py-2 text-sm font-medium {$currentPath === m.href ? "bg-indigo-50 text-indigo-700" : "text-slate-600"}">
      {m.label}
    </Link>
  {/each}
</nav>
