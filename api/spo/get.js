// api/spo/get.js
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { handleAPIError } from "../../lib/handleErrors.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return handleAPIError(res, "Method Not Allowed", 405);
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return handleAPIError(res, "Missing or invalid ID", 400);
  }

  try {
    const docRef = doc(db, "AllTimeBlockAuthors", id);
    const snapshot = await getDoc(docRef);

    res.status(200).json({
      exists: snapshot.exists(),
      id: snapshot.id,
      data: snapshot.exists() ? snapshot.data() : null,
    });
  } catch (err) {
    console.error("❌ Firestore fetch error:", err);
    return handleAPIError(res, err.message);
  }
}
