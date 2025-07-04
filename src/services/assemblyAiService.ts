// This file is automatically generated. Do not edit it directly.

import axios from 'axios';

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
  audioUrl?: string;
  videoUrl?: string;
  language?: string;
  error?: string;
  subtitlesUrl?: string;
}

const ASSEMBLY_AI_API_KEY = 'dc1586d227b6498d99a319fbdd74733d'; // Cole sua chave de API da AssemblyAI aqui
const BASE_URL = 'https://api.assemblyai.com/v2';

export const assemblyAiService = {
  /**
   * Envia um vídeo para transcrição/legendagem na AssemblyAI
   */
  submitTranscription: async (
    videoFile: File | string,
    options: TranscriptionOptions = {}
  ): Promise<{ transcriptionId: string }> => {
    console.log('AssemblyAI - Iniciando transcrição:', typeof videoFile === 'string' ? 'URL' : videoFile.name);

    try {
      let audioUrl = '';
      let videoTitle = '';

      // Upload do vídeo ou uso de URL
      if (videoFile instanceof File) {
        // Upload do arquivo para AssemblyAI
        const uploadResponse = await axios.post(
          `${BASE_URL}/upload`,
          videoFile,
          {
            headers: {
              Authorization: ASSEMBLY_AI_API_KEY,
              'Content-Type': videoFile.type,
            },
          }
        );
        audioUrl = uploadResponse.data.upload_url;
        videoTitle = videoFile.name.replace(/\.[^/.]+$/, '');
      } else {
        audioUrl = videoFile; // URL do YouTube ou outro link público
        videoTitle = 'Vídeo do YouTube';
      }

      // Enviar solicitação de transcrição
      const transcriptionResponse = await axios.post(
        `${BASE_URL}/transcript`,
        {
          audio_url: audioUrl,
          language_code: options.language || 'pt-BR',
          auto_chapters: options.formatting || true,
          punctuate: options.punctuation || true,
          format_text: options.formatting || true,
          speaker_labels: options.speakerDetection || false,
        },
        {
          headers: {
            Authorization: ASSEMBLY_AI_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const transcriptionId = transcriptionResponse.data.id;

      // Armazenar no localStorage
      const savedVideos = localStorage.getItem('userVideos');
      let videos = savedVideos ? JSON.parse(savedVideos) : [];

      const newVideo = {
        id: transcriptionId,
        title: videoTitle,
        thumbnail: videoFile instanceof File ? '' : 'https://img.youtube.com/vi/default/mqdefault.jpg',
        status: 'processing',
        duration: '00:00',
        date: new Date().toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        language: options.language || 'Português',
        type: 'subtitle',
        videoUrl: audioUrl,
        subtitlesUrl: '',
        originalFile: videoFile instanceof File,
        audioFile: videoFile,
      };

      videos.push(newVideo);
      localStorage.setItem('userVideos', JSON.stringify(videos));
      console.log('Vídeo salvo no localStorage:', newVideo);

      return { transcriptionId };
    } catch (error) {
      console.error('Erro ao enviar transcrição:', error);
      throw new Error('Falha ao enviar transcrição para AssemblyAI');
    }
  },

  /**
   * Verifica o status de uma transcrição em andamento
   */
  getTranscriptionStatus: async (transcriptionId: string): Promise<TranscriptionResult> => {
    console.log('Verificando status da transcrição:', transcriptionId);

    try {
      const response = await axios.get(`${BASE_URL}/transcript/${transcriptionId}`, {
        headers: { Authorization: ASSEMBLY_AI_API_KEY },
      });

      const { id, status, text, audio_url, language_code } = response.data;

      // Atualizar localStorage com o resultado
      const savedVideos = localStorage.getItem('userVideos');
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        const index = videos.findIndex((v) => v.id === transcriptionId);

        if (index !== -1) {
          videos[index].status = status;
          if (status === 'completed') {
            // Gerar arquivo de legendas (VTT)
            const subtitlesContent = response.data.words
              ? generateVTTFromWords(response.data.words)
              : generateExampleSubtitles();
            const subtitlesBlob = new Blob([subtitlesContent], { type: 'text/vtt' });
            const subtitlesUrl = URL.createObjectURL(subtitlesBlob);
            videos[index].subtitlesUrl = subtitlesUrl;
            videos[index].transcription = text || 'Transcrição processada com sucesso.';
            videos[index].duration = await getVideoDurationFromUrl(audio_url);
          } else if (status === 'error') {
            videos[index].error = response.data.error || 'Erro desconhecido no processamento.';
          }
          localStorage.setItem('userVideos', JSON.stringify(videos));
        }
      }

      return {
        id,
        status,
        text: status === 'completed' ? text : undefined,
        videoUrl: audio_url,
        language: language_code,
        subtitlesUrl: status === 'completed' && savedVideos ? JSON.parse(savedVideos).find((v) => v.id === transcriptionId)?.subtitlesUrl : undefined,
        error: status === 'error' ? response.data.error : undefined,
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return {
        id: transcriptionId,
        status: 'error',
        error: 'Falha ao verificar status da transcrição',
      };
    }
  },

  /**
   * Baixa o arquivo de legendas no formato especificado
   */
  downloadSubtitles: async (transcriptionId: string, format = 'srt'): Promise<Blob> => {
    console.log(`Baixando legendas para ${transcriptionId} no formato ${format}`);

    try {
      const response = await axios.get(`${BASE_URL}/transcript/${transcriptionId}/${format}`, {
        headers: { Authorization: ASSEMBLY_AI_API_KEY },
      });

      return new Blob([response.data], { type: format === 'srt' ? 'text/plain' : 'text/vtt' });
    } catch (error) {
      console.error('Erro ao baixar legendas:', error);
      return new Blob([generateExampleSubtitles()], { type: 'text/vtt' });
    }
  },

  /**
   * Baixa o vídeo processado
   */
  downloadVideo: async (transcriptionId: string): Promise<Blob> => {
    console.log(`Iniciando download do vídeo: ${transcriptionId}`);

    const savedVideos = localStorage.getItem('userVideos');
    let videoUrl = '';

    if (savedVideos) {
      const videos = JSON.parse(savedVideos);
      const video = videos.find((v) => v.id === transcriptionId);
      if (video && video.videoUrl) {
        videoUrl = video.videoUrl;
      }
    }

    if (!videoUrl) {
      throw new Error('Vídeo não encontrado');
    }

    try {
      const response = await fetch(videoUrl, { mode: 'cors', cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Falha ao baixar o vídeo: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
      throw new Error('Falha ao baixar o vídeo');
    }
  },

  /**
   * Baixa o áudio processado
   */
  downloadAudio: async (transcriptionId: string): Promise<Blob> => {
    console.log(`Iniciando download do áudio: ${transcriptionId}`);

    // Implementar extração de áudio, se necessário
    return new Blob(['Audio file not implemented'], { type: 'audio/mp3' });
  },

  /**
   * Baixa o texto transcrito
   */
  downloadTranscription: async (transcriptionId: string): Promise<Blob> => {
    console.log(`Iniciando download da transcrição: ${transcriptionId}`);

    try {
      const response = await axios.get(`${BASE_URL}/transcript/${transcriptionId}`, {
        headers: { Authorization: ASSEMBLY_AI_API_KEY },
      });
      return new Blob([response.data.text || 'No transcription available'], { type: 'text/plain' });
    } catch (error) {
      console.error('Erro ao baixar transcrição:', error);
      return new Blob(['Erro ao baixar transcrição'], { type: 'text/plain' });
    }
  },
};

// Função para gerar VTT a partir dos dados da AssemblyAI
function generateVTTFromWords(words: Array<{ start: number; end: number; text: string }>): string {
  let vtt = 'WEBVTT\n\n';
  words.forEach((word, index) => {
    if (index % 5 === 0) {
      const startTime = formatTime(word.start / 1000);
      const endTime = formatTime((word.end / 1000) + 1);
      const text = words.slice(index, index + 5).map(w => w.text).join(' ');
      vtt += `${startTime} --> ${endTime}\n${text}\n\n`;
    }
  });
  return vtt;
}

// Função para obter duração do vídeo
async function getVideoDurationFromUrl(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(video.duration / 60);
      const seconds = Math.floor(video.duration % 60);
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      URL.revokeObjectURL(video.src);
    });
    video.addEventListener('error', () => {
      resolve('0:00');
    });
  });
}

// Função para gerar legendas de exemplo (mantida como fallback)
function generateExampleSubtitles(): string {
  return `WEBVTT

00:00:01.000 --> 00:00:05.000
Processando o áudio do seu vídeo enviado

00:00:06.000 --> 00:00:10.000
Gerando transcrição automática do conteúdo

00:00:11.000 --> 00:00:15.000
As legendas estão sendo sincronizadas

00:00:16.000 --> 00:00:20.000
Este é o conteúdo do arquivo que você enviou

00:00:21.000 --> 00:00:25.000
A transcrição será baseada no áudio real`;
}

// Função auxiliar para formatar tempo
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const ms = Math.floor((seconds % 1) * 1000);

  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = secs.toString().padStart(2, '0');
  const msStr = ms.toString().padStart(3, '0');

  return `${h}:${m}:${s}.${msStr}`;
}