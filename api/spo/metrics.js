// api/spo/metrics.js
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { handleAPIError } from "../../lib/handleErrors.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return handleAPIError(res, "Method Not Allowed", 405);
  }

  try {
    const snapshot = await getDocs(collection(db, "spometrics"));

    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    res.status(200).json({ docs });
  } catch (err) {
    console.error("❌ Error fetching SPO metrics:", err);
    handleAPIError(res, err.message);
  }
}
