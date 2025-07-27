import { useGetCountryQuery } from "@generated/graphql.tsx";
import { Counter } from "@shared/counter/ui";
import { Header } from "@shared/header";
import { Descriptions } from "antd";
import type { FC } from "react";

export const IndexPage: FC = () => {
  const [{ data, fetching, error }] = useGetCountryQuery({
    variables: {
      code: "BR",
    },
  });

  return (
    <div className={"pl-16 pr-16 pt-8 pb-8 rounded-2xl shadow-xl"}>
      <Header />
      <Counter />
      <hr />
      {fetching && "Loading..."}
      {error && <>Error: {error.message}</>}
      {!data && "No data!"}
      {data?.country && (
        <div style={{ width: "30vw" }}>
          <Descriptions
            title="Country (graphql response)"
            column={1}
            size={"small"}
            colon={true}
          >
            <Descriptions.Item label={"Name"}>
              {data.country.name}
            </Descriptions.Item>
            <Descriptions.Item label={"Native"}>
              {data.country.native}
            </Descriptions.Item>
            <Descriptions.Item label={"Capital"}>
              {data.country.capital}
            </Descriptions.Item>
            <Descriptions.Item label={"Emoji"}>
              {data.country.emoji}
            </Descriptions.Item>
            <Descriptions.Item label={"Currency"}>
              {data.country.currency}
            </Descriptions.Item>
            <Descriptions.Item label={"Languages"}>
              {data.country.languages
                .map((language) => language.name)
                .join(", ")}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  );
};
