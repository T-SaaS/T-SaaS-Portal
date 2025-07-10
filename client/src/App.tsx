import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./lib/graphql";
import { queryClient } from "./lib/queryClient";
import DriverForm from "./pages/driver-form";
import "./index.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <div className="min-h-screen bg-gray-50">
          <DriverForm />
        </div>
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default App;
