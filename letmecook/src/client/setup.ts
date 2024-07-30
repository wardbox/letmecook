import { configureQueryClient } from "wasp/client/operations";

export default async function setupClient(): Promise<void> {
  configureQueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        staleTime: 1000 * 60, // 1 minute
      },
    },
  });
}
