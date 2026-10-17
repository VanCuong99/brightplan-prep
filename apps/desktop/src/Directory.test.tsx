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
