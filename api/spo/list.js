// api/spo/list.js
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { handleAPIError } from "../../lib/handleErrors.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return handleAPIError(res, "Method Not Allowed", 405);
  }

  try {
    const snapshot = await getDocs(collection(db, "SPOs"));

    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    console.log(snapshot);
    res.status(200).json({ docs });
  } catch (err) {
    console.error("❌ Error fetching SPOs:", err);
    handleAPIError(res, err.message);
  }
}
