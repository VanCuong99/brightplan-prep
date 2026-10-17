export interface Person {
  id: string;
  name: string;
  role: string;
}
// Entirely fictional; IDs are stable even when names repeat.
export const people: readonly Person[] = [
  { id: "p1", name: "Alex Morgan", role: "Frontend Engineer" },
  { id: "p2", name: "Jamie Chen", role: "Product Designer" },
  { id: "p3", name: "Sam Rivera", role: "Mobile Engineer" },
  { id: "p4", name: "Taylor Brooks", role: "QA Engineer" },
  { id: "p5", name: "Jordan Lee", role: "Engineering Manager" },
];
// Name matching trims whitespace and ignores case.
export function filterPeople(
  source: readonly Person[],
  query: string,
): readonly Person[] {
  const normalized = query.trim().toLowerCase();
  return source.filter((person) =>
    person.name.toLowerCase().includes(normalized),
  );
}
