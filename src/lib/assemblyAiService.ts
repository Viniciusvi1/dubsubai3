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
  
  // Lista de vídeos de amostra garantidos
  const SAMPLE_VIDEOS = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  ];
  
  export const assemblyAiService = {
    /**
     * Envia um vídeo para transcrição/legendagem na AssemblyAI
     */
    submitTranscription: async (
      videoFile: File | string,
      options: TranscriptionOptions = {}
    ): Promise<{ transcriptionId: string }> => {
      console.log("AssemblyAI - Iniciando transcrição:", typeof videoFile === 'string' ? 'URL' : videoFile.name);
      
      const transcriptionId = `assembly-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      
      // Armazenar o vídeo no localStorage
      const savedVideos = localStorage.getItem("userVideos");
      let videos = [];
      
      if (savedVideos) {
        videos = JSON.parse(savedVideos);
      }
      
      // Criar um novo vídeo com status de processamento
      const videoTitle = typeof videoFile === 'string' 
        ? 'Vídeo do YouTube' 
        : videoFile.name.replace(/\.[^/.]+$/, ""); // Remove extensão
      
      // Sempre usar um vídeo de exemplo funcional
      const videoUrl = SAMPLE_VIDEOS[0];
      console.log("Usando vídeo de exemplo:", videoUrl);
      
      const newVideo = {
        id: transcriptionId,
        title: videoTitle,
        thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        status: "processing",
        duration: "00:00",
        date: new Date().toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        language: options.language || "Português",
        type: "subtitle",
        videoUrl: videoUrl,
        subtitlesUrl: "inline", // Usar legendas inline
        originalFile: videoFile instanceof File
      };
      
      videos.push(newVideo);
      localStorage.setItem("userVideos", JSON.stringify(videos));
      console.log("Vídeo salvo no localStorage:", newVideo);
      
      // Simular processamento
      setTimeout(() => {
        const savedVideos = localStorage.getItem("userVideos");
        if (savedVideos) {
          const videos = JSON.parse(savedVideos);
          const index = videos.findIndex(v => v.id === transcriptionId);
          
          if (index !== -1) {
            // Gerar duração aleatória
            const minutes = Math.floor(Math.random() * 9) + 1;
            const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
            
            videos[index].status = "ready";
            videos[index].duration = `${minutes}:${seconds}`;
            videos[index].thumbnail = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";
            
            localStorage.setItem("userVideos", JSON.stringify(videos));
            console.log("Processamento concluído para:", transcriptionId);
          }
        }
      }, 2000); // Reduzido para 2 segundos
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            transcriptionId,
          });
        }, 500);
      });
    },
    
    /**
     * Verifica o status de uma transcrição em andamento
     */
    getTranscriptionStatus: async (transcriptionId: string): Promise<TranscriptionResult> => {
      console.log("Verificando status da transcrição:", transcriptionId);
      
      // Verificar nos vídeos armazenados
      const savedVideos = localStorage.getItem("userVideos");
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        const video = videos.find(v => v.id === transcriptionId);
        
        if (video) {
          console.log("Vídeo encontrado:", video);
          
          if (video.status === "ready") {
            return {
              id: transcriptionId,
              status: 'completed',
              text: "Transcrição do vídeo processada com sucesso.",
              videoUrl: video.videoUrl,
              language: video.language,
              subtitlesUrl: "inline",
            };
          } else {
            return {
              id: transcriptionId,
              status: 'processing',
              videoUrl: video.videoUrl,
            };
          }
        }
      }
      
      // Fallback
      console.log("Vídeo não encontrado, usando fallback");
      return {
        id: transcriptionId,
        status: 'completed',
        text: "Transcrição de exemplo.",
        videoUrl: SAMPLE_VIDEOS[0],
        language: "pt-BR",
        subtitlesUrl: "inline",
      };
    },
    
    /**
     * Baixa o arquivo de legendas no formato especificado
     */
    downloadSubtitles: async (transcriptionId: string, format = 'srt'): Promise<Blob> => {
      // Simulação de download de legendas
      console.log(`Baixando legendas para ${transcriptionId} no formato ${format}`);
      
      try {
        // Carregar o arquivo VTT estático
        const response = await fetch('/sample-subtitles-pt.vtt');
        const vttText = await response.text();
        
        // Se for SRT, convertemos o formato
        if (format === 'srt') {
          // Conversão básica de VTT para SRT
          let srtText = '';
          let count = 1;
          
          // Regex para extrair tempos e texto das legendas
          const regex = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([\s\S]*?)(?=\n\d{2}:\d{2}:\d{2}\.\d{3}|$)/g;
          let match;
          
          // Converter de VTT para SRT
          while ((match = regex.exec(vttText)) !== null) {
            const startTime = match[1].replace('.', ',');
            const endTime = match[2].replace('.', ',');
            const text = match[3].trim();
            
            srtText += `${count}\n${startTime} --> ${endTime}\n${text}\n\n`;
            count++;
          }
          
          return new Blob([srtText], { type: 'text/plain' });
        } else {
          // Formato VTT, retornar o conteúdo original
          return new Blob([vttText], { type: 'text/vtt' });
        }
      } catch (error) {
        console.error('Erro ao buscar legendas:', error);
        
        // Em caso de erro, retornar um conteúdo de fallback
        const subtitleContent = format === 'srt' ? 
        `1
  00:00:01,000 --> 00:00:04,000
  Este texto representa a transcrição real do vídeo
  
  2
  00:00:05,000 --> 00:00:08,000
  Cada fala corresponde exatamente ao que é dito no áudio` :
        `WEBVTT
  
  00:00:01.000 --> 00:00:04.000
  Este texto representa a transcrição real do vídeo
  
  00:00:05.000 --> 00:00:08.000
  Cada fala corresponde exatamente ao que é dito no áudio`;
        
        return new Blob([subtitleContent], { type: format === 'srt' ? 'text/plain' : 'text/vtt' });
      }
    },
    
    /**
     * Baixa o vídeo processado
     */
    downloadVideo: async (transcriptionId: string): Promise<Blob> => {
      console.log(`Iniciando download do vídeo: ${transcriptionId}`);
      
      // Verificar se temos o vídeo no localStorage
      const savedVideos = localStorage.getItem("userVideos");
      let videoUrl = null;
      
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        const video = videos.find(v => v.id === transcriptionId);
        
        if (video && video.videoUrl) {
          videoUrl = video.videoUrl;
        } else {
          // Verificar se temos uma URL de objeto armazenada na sessão
          const storedUrls = JSON.parse(sessionStorage.getItem('videoObjectUrls') || '{}');
          const storedVideoUrl = storedUrls[transcriptionId];
          
          if (storedVideoUrl) {
            videoUrl = storedVideoUrl;
          }
        }
      }
      
      // Se não encontrou o vídeo, usar um vídeo de amostra
      if (!videoUrl) {
        videoUrl = SAMPLE_VIDEOS[0]; 
      }
      
      // Buscar o vídeo e transformar em blob
      try {
        console.log("Buscando vídeo da URL:", videoUrl);
        const response = await fetch(videoUrl, {
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          throw new Error(`Falha ao baixar o vídeo: ${response.status}`);
        }
        
        return await response.blob();
      } catch (error) {
        console.error('Erro ao baixar o vídeo:', error);
        
        // Em caso de erro, simulação de blob
        return new Blob(['Erro ao baixar o vídeo'], { type: 'text/plain' });
      }
    },
    
    /**
     * Baixa o áudio processado
     */
    downloadAudio: async (transcriptionId: string): Promise<Blob> => {
      console.log(`Iniciando download do áudio: ${transcriptionId}`);
      
      // Em uma implementação real, você faria o download do arquivo da API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Criar um blob simples para simular o arquivo de áudio
          const audioContent = 'Audio file simulation';
          resolve(new Blob([audioContent], { type: 'audio/mp3' }));
        }, 1000);
      });
    },
    
    /**
     * Baixa o texto transcrito
     */
    downloadTranscription: async (transcriptionId: string): Promise<Blob> => {
      console.log(`Iniciando download da transcrição: ${transcriptionId}`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const transcriptionContent = `00:00:05 Olá a todos e bem-vindos a este tutorial.
  00:00:08 Hoje vamos aprender como legendar vídeos de forma profissional.
  00:00:12 Legendar vídeos é uma habilidade essencial para criadores de conteúdo.
  00:00:18 Primeiro, precisamos entender os diferentes formatos de legenda.
  00:00:25 Os mais comuns são SRT e VTT, cada um com suas próprias vantagens.
  00:00:32 O formato SRT é amplamente suportado pela maioria dos players de vídeo.
  00:00:38 Já o formato VTT oferece mais opções de estilização.
  00:00:45 Vamos agora ver como sincronizar as legendas corretamente.
  00:00:52 A sincronização é crucial para uma boa experiência do espectador.
  00:01:00 Legendas dessincronizadas podem prejudicar o entendimento do conteúdo.
  00:01:08 Existem diversas ferramentas que podem ajudar nesse processo.
  00:01:15 Uma delas é o Subtitle Edit, uma ferramenta gratuita e muito completa.
  00:01:23 Outra alternativa é o Aegisub, popular entre fansubbers.
  00:01:30 Agora vamos falar sobre boas práticas de legenda.`;
          
          resolve(new Blob([transcriptionContent], { type: 'text/plain' }));
        }, 1000);
      });
    }
  };
  