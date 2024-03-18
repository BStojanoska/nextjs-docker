'use client';

import { QueryClient, QueryClientProvider } from "react-query";
import Header from "../components/Header";
import Table from "../components/Table";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <>
      <Header />
      <QueryClientProvider client={queryClient}>
        <Table />
      </QueryClientProvider>
    </>
  );
}
