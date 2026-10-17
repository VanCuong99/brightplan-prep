import { useId, useState } from "react";
import { filterPeople, people, type Person } from "../../../shared/directory";
export function Directory({ source = people }: { source?: readonly Person[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const visible = filterPeople(source, query);
  return (
    <section aria-labelledby={`${inputId}-heading`}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE TEAM</span>
          <h2 id={`${inputId}-heading`}>People directory</h2>
        </div>
        <span className="count">{source.length} people</span>
      </div>
      <div className="search-bar">
        <div className="search-field">
          <label htmlFor={inputId}>Search by name</label>
          <input
            id={inputId}
            type="search"
            placeholder="Try Alex or Jamie…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="secondary" onClick={() => setQuery("")}>
          Clear search
        </button>
      </div>
      <p className="result-count" role="status">
        {visible.length} {visible.length === 1 ? "person" : "people"} found
      </p>
      {visible.length ? (
        <ul className="people">
          {visible.map((person) => (
            <li key={person.id}>
              <span className="avatar" aria-hidden="true">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
              <span className="member-tag">Team member</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <h3>No people found</h3>
          <p>
            {source.length
              ? "Try another name, or clear your search."
              : "There are no people in this directory yet."}
          </p>
        </div>
      )}
    </section>
  );
}
