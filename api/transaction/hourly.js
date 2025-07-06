import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { handleAPIError } from "../../lib/handleErrors.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return handleAPIError(res, "Method Not Allowed", 405);
  }

  try {
    const hourlyQuery = query(
      collection(db, "HourlyTransactions"),
      orderBy("__name__")
    );

    const snapshot = await getDocs(hourlyQuery);

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),   
      refPath: doc.ref.path
    }));

    res.status(200).json({ docs });
  } catch (err) {
    console.error("❌ Error fetching hourly transactions:", err);
    handleAPIError(res, err.message);
  }
}
