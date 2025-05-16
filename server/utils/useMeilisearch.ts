import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
    host: "http://127.0.0.1:7700", // TODO: change to production
  });

export const useMeilisearch = () => {
    return client;
}