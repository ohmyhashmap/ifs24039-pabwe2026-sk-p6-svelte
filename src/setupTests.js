import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// lucide-svelte di-mock: setiap ikon menjadi komponen Svelte 5 kosong
vi.mock("lucide-svelte", () => {
  const Icon = () => {};
  return { Link2: Icon, LogOut: Icon, Plus: Icon, Trash2: Icon, Search: Icon, Pencil: Icon, ExternalLink: Icon, Image: Icon };
});
