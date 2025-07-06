import { fetchGraphQL } from "../..//lib/fetchGraphQL";
import { handleAPIError } from "../../lib/handleErrors";

export default async function handler(req, res) {
  if (req.method !== "GET") return handleAPIError(res, "Method not allowed", 405);

  const query = `query { block { height } }`;

  try {
    const data = await fetchGraphQL(process.env.INDEXER_ENDPOINT, query);
    res.status(200).json(data);
  } catch (err) {
    handleAPIError(res, err.message);
  }
}