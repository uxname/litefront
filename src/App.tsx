import { JSX, useState } from "react";

import "./App.scss";

import reactLogo from "./assets/react.svg";
import { useGetAllFilmsQuery } from "./generated/graphql.tsx";

import viteLogo from "/vite.svg";

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

function App(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => setCount((previousCount: number) => previousCount + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Films />
    </>
  );
}

export default App;
