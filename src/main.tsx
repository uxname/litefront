import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

import "./index.scss";

import App from "./App.tsx";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <ApolloProvider client={makeApolloClient()}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);

function makeApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
    cache: new InMemoryCache(),
  });
}
