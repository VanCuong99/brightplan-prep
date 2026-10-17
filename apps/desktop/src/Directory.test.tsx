import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Directory } from "./Directory";
it("searches, shows a meaningful empty state, and restores all people on clear", async () => {
  const user = userEvent.setup();
  render(<Directory />);
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
  const search = screen.getByRole("searchbox", { name: "Search by name" });
  await user.type(search, "nobody");
  expect(
    screen.getByRole("heading", { name: "No people found" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Clear search" }));
  expect(search).toHaveValue("");
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
  await user.type(search, " ALEX ");
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
});
it("distinguishes an empty fixture from a no-match search", () => {
  render(<Directory source={[]} />);
  expect(
    screen.getByText("There are no people in this directory yet."),
  ).toBeInTheDocument();
});

it("combines name and role, keeps role on clear, and preserves name on All roles", async () => {
  const user = userEvent.setup();
  render(<Directory />);
  const search = screen.getByRole("searchbox", { name: "Search by name" });
  const role = screen.getByRole("combobox", { name: "Filter by role" });
  await user.selectOptions(role, "Mobile Engineer");
  await user.type(search, "SAM");
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByText("Sam Rivera")).toBeInTheDocument();
  await user.clear(search);
  await user.type(search, "Jamie");
  expect(
    screen.getByRole("heading", { name: "No people found" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Clear search" }));
  expect(search).toHaveValue("");
  expect(role).toHaveValue("Mobile Engineer");
  expect(screen.getByText("Sam Rivera")).toBeInTheDocument();
  await user.type(search, "Alex");
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  await user.selectOptions(role, "");
  expect(search).toHaveValue("Alex");
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
});
it("deduplicates role options and retains duplicate-name identities", async () => {
  const user = userEvent.setup();
  render(
    <Directory
      source={[
        { id: "a", name: "Alex", role: "Engineer" },
        { id: "b", name: "Alex", role: "Engineer" },
        { id: "c", name: "Alex", role: "Designer" },
      ]}
    />,
  );
  expect(screen.getAllByRole("option", { name: "Engineer" })).toHaveLength(1);
  await user.selectOptions(screen.getByRole("combobox"), "Engineer");
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
