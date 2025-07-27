import { useGetCountryQuery } from "@generated/graphql.tsx";
import { Counter } from "@shared/counter/ui";
import { Header } from "@widgets/Header";
import type { FC } from "react";

export const IndexPage: FC = () => {
  const [{ data, fetching, error }] = useGetCountryQuery({
    variables: {
      code: "BR",
    },
  });

  return (
    <div className="pl-16 pr-16 pt-8 pb-8 rounded-2xl shadow-xl">
      <Header />
      <Counter />
      <hr className="my-6" />
      {fetching && <div className="text-center">Loading...</div>}
      {error && (
        <div className="text-center text-error">Error: {error.message}</div>
      )}
      {!data && <div className="text-center">No data!</div>}
      {data?.country && (
        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Country (graphql response)
          </h2>
          <div className="stats stats-vertical shadow w-full">
            <div className="stat">
              <div className="stat-title">Name</div>
              <div className="stat-value text-lg">{data.country.name}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Native</div>
              <div className="stat-value text-lg">{data.country.native}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Capital</div>
              <div className="stat-value text-lg">{data.country.capital}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Emoji</div>
              <div className="stat-value text-2xl">{data.country.emoji}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Currency</div>
              <div className="stat-value text-lg">{data.country.currency}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Languages</div>
              <div className="stat-value text-lg">
                {data.country.languages
                  .map((language) => language.name)
                  .join(", ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
