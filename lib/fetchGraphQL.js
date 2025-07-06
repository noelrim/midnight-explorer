export async function fetchGraphQL(url, query) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    return await res.json();
  } catch (err) {
    console.error("GraphQL fetch failed:", err);
    throw new Error("Failed to fetch GraphQL data");
  }
}