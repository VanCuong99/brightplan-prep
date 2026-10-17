import { describe, expect, it } from "vitest";
import { filterPeople, people } from "./directory";
describe("directory contract", () => {
  it("normalizes whitespace/case and searches names rather than roles", () => {
    expect(filterPeople(people, "  ALEX ")).toEqual([people[0]]);
    expect(filterPeople(people, "Engineer")).toEqual([]);
  });
  it("returns every record on clear and never mutates the input", () => {
    const before = JSON.stringify(people);
    expect(filterPeople(people, "nobody")).toEqual([]);
    expect(filterPeople(people, "   ")).toHaveLength(5);
    expect(JSON.stringify(people)).toBe(before);
  });
  it("preserves separate identities with duplicate names", () => {
    const duplicates = [
      { id: "a", name: "Alex", role: "A" },
      { id: "b", name: "Alex", role: "B" },
    ];
    expect(filterPeople(duplicates, "alex").map((p) => p.id)).toEqual([
      "a",
      "b",
    ]);
  });
});
