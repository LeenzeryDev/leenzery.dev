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

    if (
      !data.recenttracks ||
      !data.recenttracks.track ||
      data.recenttracks.track.length === 0
    ) {
      return res.status(404).json({ error: "No tracks found" });
    }

    const track = data.recenttracks.track[0];

    let imageUrl = "";
    if (track.image && track.image.length > 0) {
      const validImages = track.image.filter((img) => img["#text"] !== "");
      if (validImages.length > 0) {
        imageUrl = validImages[validImages.length - 1]["#text"];
      }
    }

    return res.status(200).json({
      name: track.name,
      artist: track.artist["#text"],
      image: track.image[track.image.length - 1]["#text"],
      nowplaying: !!(track["@attr"] && track["@attr"].nowplaying),
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch from Last.fm" });
  }
}
