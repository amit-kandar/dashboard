"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient with default options
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60, // Data is fresh for 1 minute
			gcTime: 1000 * 60 * 5, // Cache persists for 5 minutes
			retry: 3, // Retry failed requests up to 3 times
			refetchOnWindowFocus: false, // Prevents refetching on tab/window focus
		},
	},
});

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

export default QueryProvider;
