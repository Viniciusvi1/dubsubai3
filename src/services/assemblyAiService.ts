// assemblyAiService.ts
export interface TranscriptionOptions {
  language?: string;
  speakerDetection?: boolean;
  punctuation?: boolean;
  formatting?: boolean;
}

export interface TranscriptionResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text?: string;
  videoUrl?: string;
  language?: string;
  error?: string;
  subtitlesUrl?: string;
}

const ASSEMBLY_AI_API_KEY = "9bfdbacc416c429bb159c9caa1ffc5c2"; // Substitua pela sua chave real

const BASE_URL = "https://api.assemblyai.com/v2";

export const assemblyAiService = {
  /**
   * Envia um vídeo para transcrição via URL
   */
  submitTranscription: async (
    videoUrl: string,
    options: TranscriptionOptions = {}
  ): Promise<{ transcriptionId: string }> => {
    const response = await fetch(`${BASE_URL}/transcript`, {
      method: "POST",
      headers: {
        authorization: ASSEMBLY_AI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: videoUrl,
        speaker_labels: options.speakerDetection ?? false,
        language_code: options.language || "pt",
        punctuate: options.punctuation ?? true,
        format_text: options.formatting ?? true,
        auto_chapters: false,
        subtitles: true,
        subtitles_format: "srt",
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error("Erro ao enviar vídeo: " + err.error || response.statusText);
    }

    const data = await response.json();
    return { transcriptionId: data.id };
  },

  /**
   * Consulta status da transcrição e retorna resultado
   */
  getTranscriptionStatus: async (
    transcriptionId: string
  ): Promise<TranscriptionResult> => {
    const response = await fetch(`${BASE_URL}/transcript/${transcriptionId}`, {
      headers: {
        authorization: ASSEMBLY_AI_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar status da transcrição");
    }

    const data = await response.json();

    return {
      id: data.id,
      status: data.status,
      text: data.text,
      videoUrl: data.audio_url,
      language: data.language_code,
      subtitlesUrl: data.subtitles?.srt || undefined,
      error: data.error,
    };
  },

  /**
   * Baixa o texto transcrito como .txt
   */
  downloadTranscription: async (
    transcriptionId: string
  ): Promise<Blob> => {
    const result = await assemblyAiService.getTranscriptionStatus(transcriptionId);

    if (result.status !== "completed" || !result.text) {
      throw new Error("Transcrição ainda não finalizada");
    }

    return new Blob([result.text], { type: "text/plain" });
  },

  /**
   * Baixa as legendas no formato .srt
   */
  downloadSubtitles: async (
    transcriptionId: string,
    format = "srt"
  ): Promise<Blob> => {
    const response = await fetch(
      `${BASE_URL}/transcript/${transcriptionId}/subtitles/${format}`,
      {
        headers: {
          authorization: ASSEMBLY_AI_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao baixar legendas");
    }

    const text = await response.text();
    return new Blob([text], { type: "text/plain" });
  },
};
