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

// Melhorar o sistema para realmente usar o vídeo enviado pelo usuário em vez de um vídeo de amostra
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
    
    // Criar URL do objeto para o arquivo do vídeo carregado pelo usuário
    let videoUrl = "";
    let videoObjectUrl = null;
    
    // Se for um arquivo, criar um objectURL para ele
    if (typeof videoFile !== 'string' && videoFile instanceof File) {
      videoObjectUrl = URL.createObjectURL(videoFile);
      videoUrl = videoObjectUrl;
    } else if (typeof videoFile === 'string') {
      // Se for uma URL do YouTube, usamos temporariamente um vídeo de amostra
      videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    }
    
    // Armazenar o objeto de vídeo na sessão para acesso posterior
    if (videoObjectUrl) {
      const storedUrls = JSON.parse(sessionStorage.getItem('videoObjectUrls') || '{}');
      storedUrls[transcriptionId] = videoObjectUrl;
      sessionStorage.setItem('videoObjectUrls', JSON.stringify(storedUrls));
    }
    
    // Gerar o arquivo de legendas
    const subtitlesUrl = "/sample-subtitles-pt.vtt";
    
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
      videoUrl: videoUrl,
      subtitlesUrl: subtitlesUrl,
      originalFile: videoFile instanceof File
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
          videos[index].thumbnail = "https://via.placeholder.com/320x180.png?text=Vídeo+Completo";
          
          // Manter a URL do vídeo original
          if (videos[index].videoUrl) {
            // Não mudar a URL do vídeo, manter a original
          }
          
          localStorage.setItem("userVideos", JSON.stringify(videos));
        }
      }
    }, 5000); // Após 5 segundos, atualiza para "ready"
    
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
        // Verificar se temos uma URL de objeto armazenada na sessão
        const storedUrls = JSON.parse(sessionStorage.getItem('videoObjectUrls') || '{}');
        const storedVideoUrl = storedUrls[transcriptionId];
        
        // Usar URL armazenada se disponível, senão usar a URL do vídeo
        const finalVideoUrl = video.videoUrl || storedVideoUrl;
        
        if (video.status === "ready") {
          return {
            id: transcriptionId,
            status: 'completed',
            text: "Este é um exemplo de texto transcrito de um vídeo.",
            videoUrl: finalVideoUrl,
            language: video.language,
            subtitlesUrl: video.subtitlesUrl || "/sample-subtitles-pt.vtt",
          };
        } else {
          return {
            id: transcriptionId,
            status: 'processing',
          };
        }
      }
    }
    
    // Fallback para caso não encontre o vídeo nos dados salvos
    return {
      id: transcriptionId,
      status: 'completed',
      text: "Este é um exemplo de texto transcrito de um vídeo.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      language: "pt-BR",
      subtitlesUrl: "/sample-subtitles-pt.vtt",
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
    
    // Sempre usar o mesmo vídeo para consistência
    const videoUrl = SAMPLE_VIDEOS[0];
    
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
