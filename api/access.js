export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.ACCESS_PASSWORD;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Password required' });
  }

  if (password === correctPassword) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }
}