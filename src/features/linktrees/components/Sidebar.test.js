import { it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { navigate } from "../../../router.js";
import Sidebar from "./Sidebar.svelte";

it("Sidebar menandai menu aktif", () => {
  navigate("/users");
  render(Sidebar);
  expect(screen.getByText("Pengguna").className).toMatch(/bg-indigo-50/);
  expect(screen.getByText("Semua Link Tree").className).toMatch(/text-slate-600/);
  expect(screen.getByText("Profil")).toHaveAttribute("href", "/profile");
});
