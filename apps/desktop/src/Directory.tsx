import { useId, useState } from "react";
import { filterPeople, people, type Person } from "../../../shared/directory";
export function Directory({ source = people }: { source?: readonly Person[] }) {
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const inputId = useId();
  const roles = [...new Set(source.map((person) => person.role))].sort();
  const visible = filterPeople(source, query).filter(
    (person) => !selectedRole || person.role === selectedRole,
  );
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
        <div className="role-field">
          <label htmlFor={`${inputId}-role`}>Filter by role</label>
          <select
            id={`${inputId}-role`}
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <button className="secondary" onClick={() => setQuery("")}>
          Clear search
        </button>
      </div>
      <p className="filter-hint">
        Clear search resets the name and keeps the selected role.
      </p>
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
              ? "Try another name or choose All roles."
              : "There are no people in this directory yet."}
          </p>
        </div>
      )}
    </section>
  );
}
