export default async function handler(req, res) {
  try {
    const odeResponse = await fetch(process.env.NODE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "sidechain_getStatus",
        params: [],
        id: 1,
      }),
    });

    const data = await odeResponse.json();
    res.status(200).json(data);
  } catch (err) {
    handleAPIError(res, err.message);
  }
}
