export interface DubbingOptions {
  voiceId: string;
  language: string;
  style: "formal" | "casual" | "young" | "senior";
  gender?: 'male' | 'female';
  speed?: number;
}

export interface DubbingResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  audioUrl?: string;
  error?: string;
  duration?: number;
}

export const elevenLabsService = {
  /**
   * Envia um texto e/ou vídeo para dublagem na ElevenLabs
   */
  submitDubbing: async (
    textOrVideoFile: string | File,
    options: DubbingOptions
  ): Promise<{ dubbingId: string }> => {
    // Simulação de API call para ElevenLabs
    console.log(`Enviando para dublagem com as opções:`, options);
    
    const dubbingId = `eleven-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Armazenar o vídeo no localStorage
    const savedVideos = localStorage.getItem("userVideos");
    let videos = [];
    
    if (savedVideos) {
      videos = JSON.parse(savedVideos);
    }
    
    // Criar um novo vídeo com status de processamento
    const videoTitle = typeof textOrVideoFile === 'string' 
      ? 'Vídeo do YouTube' 
      : textOrVideoFile.name;
      
    const newVideo = {
      id: dubbingId,
      title: videoTitle,
      thumbnail: "https://via.placeholder.com/320x180.png?text=Processando",
      status: "processing",
      duration: "00:00",
      date: new Date().toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      language: "Português",
      targetLanguage: options.language,
      type: "dubbing"
    };
    
    videos.push(newVideo);
    localStorage.setItem("userVideos", JSON.stringify(videos));
    
    // Iniciar simulação do processamento
    setTimeout(() => {
      // Atualizar o status após um tempo
      const savedVideos = localStorage.getItem("userVideos");
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        const index = videos.findIndex(v => v.id === dubbingId);
        
        if (index !== -1) {
          videos[index].status = "ready";
          videos[index].duration = `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
          videos[index].thumbnail = "https://via.placeholder.com/320x180.png?text=Video+Completo";
          localStorage.setItem("userVideos", JSON.stringify(videos));
        }
      }
    }, 10000); // Após 10 segundos, atualiza para "ready"
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dubbingId,
        });
      }, 1500);
    });
  },
  
  /**
   * Verifica o status de uma dublagem em andamento
   */
  getDubbingStatus: async (dubbingId: string): Promise<DubbingResult> => {
    // Simulação de API call para verificar status
    console.log(`Verificando status da dublagem: ${dubbingId}`);
    
    // Verificar nos vídeos armazenados
    const savedVideos = localStorage.getItem("userVideos");
    if (savedVideos) {
      const videos = JSON.parse(savedVideos);
      const video = videos.find(v => v.id === dubbingId);
      
      if (video) {
        if (video.status === "ready") {
          return {
            id: dubbingId,
            status: 'completed',
            audioUrl: "https://example.com/dubbed-audio.mp3",
            duration: 45.6,
          };
        } else {
          return {
            id: dubbingId,
            status: 'processing',
          };
        }
      }
    }
    
    // Fallback para o comportamento anterior
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulação de diferentes estados possíveis
        resolve({
          id: dubbingId,
          status: 'completed',
          audioUrl: "https://example.com/dubbed-audio.mp3",
          duration: 45.6,
        });
      }, 1000);
    });
  },
  
  /**
   * Obtém a lista de vozes disponíveis
   */
  getAvailableVoices: async (language?: string): Promise<Array<{id: string, name: string, gender: string}>> => {
    // Simulação de obtenção da lista de vozes
    console.log(`Buscando vozes disponíveis ${language ? `para ${language}` : ''}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lista simulada de vozes
        resolve([
          { id: 'voice-1', name: 'Camila', gender: 'female' },
          { id: 'voice-2', name: 'Ricardo', gender: 'male' },
          { id: 'voice-3', name: 'Patrícia', gender: 'female' },
          { id: 'voice-4', name: 'Bruno', gender: 'male' },
          { id: 'voice-5', name: 'Ana', gender: 'female' },
        ]);
      }, 800);
    });
  },
  
  /**
   * Baixa o arquivo de áudio dublado
   */
  downloadDubbedAudio: async (dubbingId: string, format = 'mp3'): Promise<Blob> => {
    // Simulação de download de áudio
    console.log(`Baixando áudio dublado para ${dubbingId} no formato ${format}`);
    
    // Em uma implementação real, você faria o download do arquivo da API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Criar um blob simples para simular o arquivo de áudio
        resolve(new Blob([], { type: 'audio/mpeg' }));
      }, 1000);
    });
  }
};
