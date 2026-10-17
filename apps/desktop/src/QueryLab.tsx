import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { people } from "../../../shared/directory";
import { Directory } from "./Directory";
export function QueryLab() {
  const [failNext, setFailNext] = useState(true);
  const query = useQuery({
    queryKey: ["practice-people"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (failNext) {
        setFailNext(false);
        throw new Error(
          "Simulated connection error. Retry to load the local fixture.",
        );
      }
      return people;
    },
    retry: false,
    staleTime: 60_000,
  });
  return (
    <section>
      <div className="lab-note">
        <strong>Async learning extension</strong>
        <p>
          Local fixture with a simulated delay and one failure. No backend is
          connected.
        </p>
      </div>
      {query.isPending ? (
        <p role="status">Loading people…</p>
      ) : query.isError ? (
        <div role="alert">
          <p>{query.error.message}</p>
          <button onClick={() => void query.refetch()}>Retry loading</button>
        </div>
      ) : (
        <Directory source={query.data} />
      )}
    </section>
  );
}
