const API_KEY = "9bfdbacc416c429bb159c9caa1ffc5c2";

export async function transcreverAudioDoVideo(videoUrl: string) {
  const response = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: videoUrl,
      language_code: "pt",
    }),
  });

  const data = await response.json();
  return data;
}
