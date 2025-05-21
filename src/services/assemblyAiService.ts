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

// Lista de vídeos de exemplo para garantir conteúdo reproduzível
const SAMPLE_VIDEOS = [
  "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
];

export const assemblyAiService = {
  /**
   * Envia um vídeo para transcrição/legendagem na AssemblyAI
   */
  submitTranscription: async (
    videoFile: File | string,
    options: TranscriptionOptions = {}
  ): Promise<{ transcriptionId: string }> => {
    // Simulação de API call para AssemblyAI
    console.log(`Enviando vídeo para transcrição com as opções:`, options);
    
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
      : videoFile.name;
      
    // Escolher um vídeo de amostra aleatório para garantir conteúdo reproduzível
    const randomIndex = Math.floor(Math.random() * SAMPLE_VIDEOS.length);
    const videoUrl = SAMPLE_VIDEOS[randomIndex];
    
    const newVideo = {
      id: transcriptionId,
      title: videoTitle,
      thumbnail: "https://via.placeholder.com/320x180.png?text=Processando",
      status: "processing",
      duration: "00:00",
      date: new Date().toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      language: options.language || "Português",
      type: "subtitle",
      videoUrl: videoUrl // Adicionando URL do vídeo de exemplo
    };
    
    videos.push(newVideo);
    localStorage.setItem("userVideos", JSON.stringify(videos));
    
    // Iniciar simulação do processamento
    setTimeout(() => {
      // Atualizar o status após um tempo
      const savedVideos = localStorage.getItem("userVideos");
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        const index = videos.findIndex(v => v.id === transcriptionId);
        
        if (index !== -1) {
          // Gerar duração aleatória entre 1:00 e 9:59
          const minutes = Math.floor(Math.random() * 9) + 1;
          const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
          
          videos[index].status = "ready";
          videos[index].duration = `${minutes}:${seconds}`;
          videos[index].thumbnail = "https://via.placeholder.com/320x180.png?text=Video+Completo";
          videos[index].videoUrl = videoUrl; // Garantir que temos uma URL de vídeo válida
          localStorage.setItem("userVideos", JSON.stringify(videos));
        }
      }
    }, 10000); // Após 10 segundos, atualiza para "ready"
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transcriptionId,
        });
      }, 1500);
    });
  },
  
  /**
   * Verifica o status de uma transcrição em andamento
   */
  getTranscriptionStatus: async (transcriptionId: string): Promise<TranscriptionResult> => {
    // Verificar nos vídeos armazenados
    const savedVideos = localStorage.getItem("userVideos");
    if (savedVideos) {
      const videos = JSON.parse(savedVideos);
      const video = videos.find(v => v.id === transcriptionId);
      
      if (video) {
        if (video.status === "ready") {
          return {
            id: transcriptionId,
            status: 'completed',
            text: "Este é um exemplo de texto transcrito de um vídeo.",
            videoUrl: video.videoUrl,
            language: video.language,
            subtitlesUrl: "https://example.com/subtitles.srt",
          };
        } else {
          return {
            id: transcriptionId,
            status: 'processing',
          };
        }
      }
    }
    
    // Fallback para um vídeo de exemplo garantido
    const randomIndex = Math.floor(Math.random() * SAMPLE_VIDEOS.length);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: transcriptionId,
          status: 'completed',
          text: "Este é um exemplo de texto transcrito de um vídeo.",
          videoUrl: SAMPLE_VIDEOS[randomIndex],
          language: "pt-BR",
          subtitlesUrl: "https://example.com/subtitles.srt",
        });
      }, 1000);
    });
  },
  
  /**
   * Baixa o arquivo de legendas no formato especificado
   */
  downloadSubtitles: async (transcriptionId: string, format = 'srt'): Promise<Blob> => {
    // Simulação de download de legendas
    console.log(`Baixando legendas para ${transcriptionId} no formato ${format}`);
    
    // Em uma implementação real, você faria o download do arquivo da API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Criar um blob simples para simular o arquivo
        const subtitleContent = `1
00:00:01,000 --> 00:00:04,000
Este é um exemplo de legenda.

2
00:00:05,000 --> 00:00:08,000
Gerado pelo DubSubAI.`;
        
        resolve(new Blob([subtitleContent], { type: 'text/plain' }));
      }, 1000);
    });
  },
  
  /**
   * Baixa o vídeo processado
   */
  downloadVideo: async (transcriptionId: string): Promise<Blob> => {
    console.log(`Iniciando download do vídeo: ${transcriptionId}`);
    
    // Obter a URL do vídeo
    const savedVideos = localStorage.getItem("userVideos");
    let videoUrl = SAMPLE_VIDEOS[0]; // Valor padrão garantido
    
    if (savedVideos) {
      const videos = JSON.parse(savedVideos);
      const video = videos.find(v => v.id === transcriptionId);
      if (video && video.videoUrl) {
        videoUrl = video.videoUrl;
      }
    }
    
    // Buscar o vídeo e transformar em blob
    try {
      console.log("Buscando vídeo da URL:", videoUrl);
      const response = await fetch(videoUrl, {
        mode: 'cors', // Tentar com CORS
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Falha ao baixar o vídeo: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
      
      // Em caso de erro, retornamos um vídeo local de exemplo
      try {
        // Tentar outro vídeo do nosso array
        const backupVideoUrl = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
        console.log("Tentando URL de backup:", backupVideoUrl);
        
        const backupResponse = await fetch(backupVideoUrl);
        if (backupResponse.ok) {
          return await backupResponse.blob();
        }
      } catch (backupError) {
        console.error('Erro ao baixar vídeo de backup:', backupError);
      }
      
      // Simulação de blob para casos de erro
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
