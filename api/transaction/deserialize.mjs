import { default as deserializeTransaction } from '../../lib/deserializeTransaction.mjs';

export default async function handler(req, res) {
  if (req.method !== "POST") return   res.status(405).json({ error: "Method Not Allowed" });

  const { txHex } = req.body;
  if (!txHex) return res.status(400).json({ error: "Missing txHex in request body" }); 
  try {
    const transaction = await deserializeTransaction(txHex); // <-- second parameter is Network ID, by default it is set to TestNet, should be parametrized in the future

    res.status(200).json({
      message: "Transaction deserialized successfully",
      transaction,
    });
  } catch (err) {
    console.error("❌ Deserialization failed:", err);
    res.status(400).json({ error: err.message || "Internal Server Error"});

  }
}