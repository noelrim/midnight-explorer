export function handleAPIError(res, message, status = 500) {
  console.error("API Error:", message);
  res.status(status).json({ error: message });
}