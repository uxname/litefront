import { JSX } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useGetAllFilmsQuery } from "../generated/graphql.tsx";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Films(): JSX.Element {
  const { loading, data, error } = useGetAllFilmsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data!</p>;

  return (
    <div>
      <h2>Star Wars Films</h2>
      {data.allFilms?.films?.map((film) => (
        <div key={film?.id}>
          <span>
            <b>{film?.title}</b> (Episode №: {film?.episodeID})
          </span>
        </div>
      ))}
    </div>
  );
}

function Index(): JSX.Element {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Films />
    </div>
  );
}
