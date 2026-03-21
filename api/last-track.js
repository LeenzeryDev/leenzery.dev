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

    if (!data.recenttracks?.track?.[0]) {
      return res.status(404).json({ error: "No tracks found" });
    }

    const track = data.recenttracks.track[0];
    const name = track.name;
    const artist = track.artist["#text"];

    // ищем картинку ручками для обложки, ибо ластфм их почему-то отдаёт пустыми
    if (name && artist) {
      try {
        const infoRes = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(name)}&format=json`,
        );
        const infoData = await infoRes.json();
        imageUrl =
          getImg(infoData?.track?.album?.image) ||
          getImg(infoData?.track?.image);
      } catch (e) {
        console.error("LFM Info Fallback Error:", e);
      }
    }

    return res.status(200).json({
      name,
      artist,
      image: imageUrl,
      nowplaying: !!(track["@attr"] && track["@attr"].nowplaying),
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch from Last.fm" });
  }
}
