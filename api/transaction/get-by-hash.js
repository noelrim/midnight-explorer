import { fetchGraphQL } from "../../lib/fetchGraphQL";
import { handleAPIError } from "../../lib/handleErrors";

export default async function handler(req, res) {
  if (req.method !== "GET") return handleAPIError(res, "Method Not Allowed", 405);

  const { hash } = req.query;

  if (!hash) return handleAPIError(res, "Missing hash parameter", 400);

  const query = `
    query {
      transactions(offset: { hash: "${hash}" }) {
        hash
        protocolVersion
        merkleTreeRoot
        block { height hash timestamp }
        applyStage
        identifiers
        raw
        contractActions {
          __typename
          ... on ContractDeploy { address state chainState }
          ... on ContractCall { address state entryPoint chainState }
          ... on ContractUpdate { address state chainState }
        }
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
