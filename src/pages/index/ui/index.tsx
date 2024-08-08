import type { FC } from "react";

import { useGetAllFilmsQuery } from "../../../generated/graphql.tsx";
import { Counter } from "../../../shared/counter/ui";
import { Header } from "../../../shared/header";

export const IndexPage: FC = () => {
  const [result] = useGetAllFilmsQuery({
    variables: {
      first: 5,
    },
  });
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data!</p>;

  return (
    <div>
      <Header />
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
};
