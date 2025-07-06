import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { handleAPIError } from "../../lib/handleErrors.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return handleAPIError(res, "Method Not Allowed", 405);
  }

  try {
    const q = query(collection(db, "EpochSPOStats"), orderBy("Date"));
    const snapshot = await getDocs(q);

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(), 
      refPath: doc.ref.path
    }));

    res.status(200).json({ docs });
  } catch (err) {
    console.error("❌ Error fetching EpochSPOStats:", err);
    handleAPIError(res, err.message);
  }
}
