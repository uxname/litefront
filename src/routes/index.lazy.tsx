import { JSX } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import { Counter } from "../components/counter.tsx";
import { useGetAllFilmsQuery } from "../generated/graphql.tsx";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index(): JSX.Element {
  const { loading, data, error } = useGetAllFilmsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data!</p>;

  return (
    <div>
      <Counter />
      <hr />
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
