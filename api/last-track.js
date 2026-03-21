export default async function handler(req, res) {
  const LFM_USER = "leenzery";
  const LFM_API_KEY = process.env.LFM_API_KEY;

  // cors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (!LFM_API_KEY) {
    return res
      .status(500)
      .json({ error: "LFM_API_KEY is not set in environment variables" });
  }

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFM_USER}&api_key=${LFM_API_KEY}&format=json&limit=1`,
    );
    const data = await response.json();
    const track = data.recenttracks.track[0];

    if (!track) {
      return res.status(404).json({ error: "No tracks found" });
    }

    return res.status(200).json({
      name: track.name,
      artist: track.artist["#text"],
      nowplaying: !!(track["@attr"] && track["@attr"].nowplaying),
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch from Last.fm" });
  }
}
