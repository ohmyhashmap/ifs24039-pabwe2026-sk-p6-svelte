import { it, expect } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, snippet } from "../../../test-utils.js";
import LinkTreeLayout from "./LinkTreeLayout.svelte";

it("layout membungkus navbar, sidebar, dan konten", () => {
  renderWithProviders(LinkTreeLayout, { props: { children: snippet("<p>isi halaman</p>") }, stores: { profile: { name: "Ani" } } });
  expect(screen.getByText("Ani")).toBeInTheDocument();
  expect(screen.getByText("Semua Link Tree")).toBeInTheDocument();
  expect(screen.getByText("isi halaman")).toBeInTheDocument();
});
