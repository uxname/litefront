import type { FC } from "react";
import { useGetAllFilmsQuery } from "@generated/graphql.tsx";
import { Counter } from "@shared/counter/ui";
import { Header } from "@shared/header";

export const IndexPage: FC = () => {
  const [{ data, fetching, error }] = useGetAllFilmsQuery({
    variables: {
      first: 5,
    },
  });

  return (
    <div>
      <Header />
      <Counter />
      <hr />
      <h2>Star Wars Films</h2>
      {fetching && <>Loading...</>}
      {error && <>Error: {error.message}</>}
      {!data && <>No data!</>}
      {data?.allFilms?.films?.map((film) => (
        <div key={film?.id}>
          <span>
            <b>{film?.title}</b> (Episode №: {film?.episodeID})
          </span>
        </div>
      ))}
    </div>
  );
};
