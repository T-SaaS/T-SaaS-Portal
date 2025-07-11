import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./lib/graphql";
import { queryClient } from "./lib/queryClient";
import { AppRouter } from "./routes";
import "./index.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <AppRouter />
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default App;
