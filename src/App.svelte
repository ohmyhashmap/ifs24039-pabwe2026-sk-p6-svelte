<script>
  import { onMount } from "svelte";
  import { currentPath, resolveRoute, navigate } from "./router.js";
  import { profile, loadProfile } from "./features/auth/states/authStore.js";
  import AuthLayout from "./features/auth/layouts/AuthLayout.svelte";
  import LoginPage from "./features/auth/pages/LoginPage.svelte";
  import RegisterPage from "./features/auth/pages/RegisterPage.svelte";
  import LinkTreeLayout from "./features/linktrees/layouts/LinkTreeLayout.svelte";
  import HomePage from "./features/linktrees/pages/HomePage.svelte";
  import DetailPage from "./features/linktrees/pages/DetailPage.svelte";
  import UsersPage from "./features/users/pages/UsersPage.svelte";
  import ProfilePage from "./features/users/pages/ProfilePage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";

  const pages = {
    login: LoginPage, register: RegisterPage, home: HomePage, detail: DetailPage,
    users: UsersPage, profile: ProfilePage, notfound: NotFoundPage,
  };

  let ready = $state(false);
  const route = $derived(resolveRoute($currentPath));
  const Page = $derived(pages[route.name]);

  onMount(async () => {
    await loadProfile();
    ready = true;
  });

  $effect(() => {
    if (!ready) return;
    if (route.layout === "app" && !$profile) navigate("/auth/login", { replace: true });
    else if (route.layout === "auth" && $profile) navigate("/", { replace: true });
  });
</script>

{#if !ready}
  <main><h1 class="py-20 text-center text-base font-normal text-slate-600">Memuat...</h1></main>
{:else if route.layout === "auth" && !$profile}
  <AuthLayout><Page /></AuthLayout>
{:else if route.layout === "app" && $profile}
  <LinkTreeLayout><Page params={route.params} /></LinkTreeLayout>
{/if}
