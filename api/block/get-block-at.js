import { fetchGraphQL } from "../../lib/fetchGraphQL";
import { handleAPIError } from "../../lib/handleErrors";

export default async function handler(req, res) {
  if (req.method !== "GET") return handleAPIError(res, "Method Not Allowed", 405);

  const { height } = req.query;

  if (!height) return handleAPIError(res, "Missing height parameter", 400);

  const query = `
    query {
      block(offset: { height: ${height} }) {
        hash
        height
        timestamp
        protocolVersion
        author
        parent { hash }
        transactions { hash }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(process.env.INDEXER_ENDPOINT, query);
    res.status(200).json(data);
  } catch (err) {
    handleAPIError(res, err.message);
  }
}
