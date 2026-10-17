import { test, expect } from "@playwright/test";

test("role filter: AND matching, empty state, clear policy, All roles and narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto("/");
  const role = page.getByRole("combobox", { name: "Filter by role" });
  const search = page.getByRole("searchbox", { name: "Search by name" });
  await expect(page.getByRole("listitem")).toHaveCount(5);
  await role.selectOption("Mobile Engineer");
  await search.fill("SAM");
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByText("Sam Rivera")).toBeVisible();
  await page.screenshot({
    path: "test-results/role-filter/matched.png",
    fullPage: true,
  });
  await search.fill("Jamie");
  await expect(
    page.getByRole("heading", { name: "No people found" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/role-filter/no-match.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(role).toHaveValue("Mobile Engineer");
  await expect(search).toHaveValue("");
  await expect(page.getByText("Sam Rivera")).toBeVisible();
  await page.screenshot({
    path: "test-results/role-filter/clear-preserves-role.png",
    fullPage: true,
  });
  await search.fill("Alex");
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await role.selectOption("");
  await expect(search).toHaveValue("Alex");
  await expect(page.getByText("Alex Morgan")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(role).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Clear search" }),
  ).toBeVisible();
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  expect(overflows).toBe(false);
  await page.locator(".panel").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "test-results/role-filter/narrow.png",
    fullPage: false,
  });
});
