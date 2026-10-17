import { it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import { profile } from "../../auth/states/authStore.js";
import Navbar from "./Navbar.svelte";

it("Navbar menampilkan nama & logout", async () => {
  renderWithProviders(Navbar, { stores: { profile: { name: "Ani" } } });
  expect(screen.getByText("Ani")).toBeInTheDocument();
  await fireEvent.click(screen.getByLabelText("Keluar"));
  expect(get(profile)).toBeNull();
  expect(window.location.pathname).toBe("/auth/login");
});
it("Navbar tanpa profil", () => {
  renderWithProviders(Navbar);
  expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
});
