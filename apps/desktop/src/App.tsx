import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Directory } from "./Directory";
import { QueryLab } from "./QueryLab";
export default function App() {
  const [mode, setMode] = useState<"local" | "async">("local");
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <div className="app-shell">
        <aside>
          <a className="brand" href="/">
            brightplan<span>practice lab</span>
          </a>
          <p className="sidebar-label">WORKSPACE</p>
          <nav aria-label="Practice modes">
            <button
              aria-pressed={mode === "local"}
              onClick={() => setMode("local")}
            >
              People directory <span>01</span>
            </button>
            <button
              aria-pressed={mode === "async"}
              onClick={() => setMode("async")}
            >
              Async query lab <span>02</span>
            </button>
          </nav>
          <div className="sidebar-note">
            One small app.
            <br />
            Understand every decision.
          </div>
        </aside>
        <main>
          <header>
            <span>INTERVIEW PREPARATION</span>
            <span className="local-badge">Local data only</span>
          </header>
          <div className="intro">
            <span className="eyebrow">BUILD · EXPLAIN · VERIFY</span>
            <h1>
              A small team.
              <br />A clear starting point.
            </h1>
            <p>
              Five fictional people. One shared model.
              <br />
              Explore the behavior, then explain how it works.
            </p>
          </div>
          <div className="panel">
            {mode === "local" ? <Directory /> : <QueryLab />}
          </div>
          <footer>
            React desktop · Shared local fixture · AI-assisted demo
          </footer>
        </main>
      </div>
    </QueryClientProvider>
  );
}
