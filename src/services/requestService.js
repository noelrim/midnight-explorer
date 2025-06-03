const REQUEST = {
  INDEXER_ENDPOINT: "https://indexer-rs.testnet-02.midnight.network/api/v1/graphql",
  async fetchPOSTResponse(url, payload) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e) {
      console.error("POST request error:", e);
      return null;
    }
  },
  async getBlockAtHeight(height) {
    const payload = {
      query: `
        query {
          block(offset: { height: ${height} }) {
            hash
            height
            protocolVersion
            timestamp
            author
            parent {
              hash
            }
            transactions {
              hash
            }
          }
        }
      `,
    };
    return this.fetchPOSTResponse(this.INDEXER_ENDPOINT, payload);
  },
  async getTransactionByHash(hash){
    const payload ={
      query: `query {
        transactions(offset: { hash: "${hash}" }) {
          hash
          protocolVersion
          merkleTreeRoot
          block {
            height
            hash
            timestamp
          }
          applyStage
          identifiers
          raw
          contractActions {
            __typename
            ... on ContractDeploy {
              address
              state
              chainState
            }
            ... on ContractCall {
              address
              state
              entryPoint
              chainState
            }
            ... on ContractUpdate {
              address
              state
              chainState
            }
          }
        }
      }`,
    };    
    return this.fetchPOSTResponse(this.INDEXER_ENDPOINT, payload);
  }
};

export default REQUEST;
