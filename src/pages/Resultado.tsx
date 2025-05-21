import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assemblyAiService } from "@/services/assemblyAiService";

export default function Result() {
  const { id } = useParams();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copied, setCopied] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [subtitlesLoaded, setSubtitlesLoaded] = useState(false);
  const [loadingSubtitles, setLoadingSubtitles] = useState(false);
  const [videoInfo, setVideoInfo] = useState({
    id: id || "",
    title: "Carregando...",
    originalLanguage: "Português (Brasil)",
    targetLanguage: "Inglês (EUA)",
    serviceType: "Legenda + Tradução",
    duration: "0:00",
    processingTime: "2 minutos",
    processedDate: "Carregando...",
    videoUrl: "",
    thumbnailUrl: "https://via.placeholder.com/1280x720.png?text=Carregando...",
    subtitlesUrl: "/sample-subtitles-pt.vtt",
  });
  
  // Carregar informações do vídeo
  useEffect(() => {
    if (!id) return;
    
    // Buscar os dados do vídeo no localStorage e no serviço
    assemblyAiService.getTranscriptionStatus(id)
      .then(result => {
        if (result.status === 'completed') {
          // Primeiro atualizar com dados do serviço
          setVideoInfo(prev => ({
            ...prev,
            videoUrl: result.videoUrl || prev.videoUrl,
            subtitlesUrl: result.subtitlesUrl || "/sample-subtitles-pt.vtt?v=" + Date.now() // Evitar cache
          }));
          
          // Depois complementar com dados do localStorage
          const savedVideos = localStorage.getItem("userVideos");
          if (savedVideos) {
            const videos = JSON.parse(savedVideos);
            const video = videos.find(v => v.id === id);
            
            if (video) {
              // Verificar se temos uma URL de objeto armazenada na sessão
              const storedUrls = JSON.parse(sessionStorage.getItem('videoObjectUrls') || '{}');
              const storedVideoUrl = storedUrls[id];
              
              // Usar URL armazenada se disponível, senão usar a URL do vídeo
              const finalVideoUrl = video.videoUrl || storedVideoUrl;
              
              setVideoInfo(prev => ({
                ...prev,
                title: video.title || "Vídeo sem título",
                originalLanguage: video.language || "Português (Brasil)",
                targetLanguage: video.targetLanguage || "Inglês (EUA)",
                serviceType: video.type === "subtitle" ? "Legendagem" : 
                            video.type === "dubbing" ? "Dublagem" : "Tradução",
                duration: video.duration || "0:00",
                processedDate: video.date || "Sem data",
                thumbnailUrl: video.thumbnail || "https://via.placeholder.com/1280x720.png?text=Sem+Thumbnail",
                videoUrl: finalVideoUrl,
              }));
            }
          }
        }
      })
      .catch(error => {
        console.error("Erro ao buscar status da transcrição:", error);
        toast({
          title: "Erro ao carregar vídeo",
          description: "Não foi possível obter as informações do vídeo. Tente novamente.",
          variant: "destructive",
        });
      });
  }, [id, toast]);

  // Configurar as legendas quando o vídeo for carregado
  useEffect(() => {
    if (!videoRef.current || !videoInfo.subtitlesUrl) return;
    
    const loadSubtitles = () => {
      if (!videoRef.current) return;
      setLoadingSubtitles(true);
      
      // Garantir que o elemento de vídeo tenha sido carregado
      if (videoRef.current.readyState < 1) {
        videoRef.current.addEventListener('loadedmetadata', setupTextTracks, { once: true });
      } else {
        setupTextTracks();
      }
    };
    
    const setupTextTracks = () => {
      if (!videoRef.current) return;
      
      // Remover todas as faixas existentes para evitar duplicações
      while (videoRef.current.textTracks.length > 0) {
        const track = videoRef.current.textTracks[0];
        if (track && 'remove' in track) {
          // @ts-ignore - Alguns navegadores suportam remove()
          track.remove();
        }
      }
      
      // Certificar de que todas as faixas existentes estão desativadas
      for (let i = 0; i < videoRef.current.textTracks.length; i++) {
        videoRef.current.textTracks[i].mode = 'disabled';
      }
      
      // Criar e adicionar uma nova faixa de texto
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = 'Português';
      track.srcLang = 'pt-BR';
      track.src = videoInfo.subtitlesUrl + '?v=' + new Date().getTime(); // Evitar cache
      track.default = true;
      
      // Adicionar evento de carregamento à faixa
      track.addEventListener('load', () => {
        console.log("Faixa de legendas carregada com sucesso");
        setSubtitlesLoaded(true);
        setLoadingSubtitles(false);
      });
      
      // Adicionar evento de erro à faixa
      track.addEventListener('error', (e) => {
        console.error("Erro ao carregar as legendas:", e);
        setLoadingSubtitles(false);
      });
      
      videoRef.current.appendChild(track);
      
      // Ativar a faixa após adicioná-la
      setTimeout(() => {
        if (videoRef.current && videoRef.current.textTracks.length > 0) {
          videoRef.current.textTracks[0].mode = 'showing';
        }
      }, 100);
    };
    
    loadSubtitles();
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', setupTextTracks);
      }
    };
  }, [videoInfo.videoUrl, videoInfo.subtitlesUrl]);
  
  // Verificar se as legendas estão sendo exibidas através dos eventos cuechange
  useEffect(() => {
    if (!videoRef.current) return;
    
    const handleCueChange = () => {
      if (videoRef.current && videoRef.current.textTracks && videoRef.current.textTracks.length > 0) {
        const track = videoRef.current.textTracks[0];
        if (track.activeCues && track.activeCues.length > 0) {
          const cue = track.activeCues[0] as VTTCue;
          console.log("Legendas ativas:", cue.text);
          setSubtitlesLoaded(true);
          setLoadingSubtitles(false);
        }
      }
    };
    
    const handleVideoLoaded = () => {
      console.log("Vídeo carregado com sucesso");
      setVideoLoaded(true);
      
      // Verificar legendas após o carregamento do vídeo
      if (videoRef.current && videoRef.current.textTracks && videoRef.current.textTracks.length > 0) {
        const track = videoRef.current.textTracks[0];
        track.mode = 'showing';
        
        // Verificar se já tem legendas carregadas
        if (track.cues && track.cues.length > 0) {
          setSubtitlesLoaded(true);
          setLoadingSubtitles(false);
        } else {
          setLoadingSubtitles(true);
        }
      }
    };
    
    // Registrar event listeners para o vídeo
    videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
    
    // Registrar event listeners para legendas se existirem
    if (videoRef.current.textTracks && videoRef.current.textTracks.length > 0) {
      const track = videoRef.current.textTracks[0];
      track.addEventListener('cuechange', handleCueChange);
      
      return () => {
        track.removeEventListener('cuechange', handleCueChange);
        videoRef.current?.removeEventListener('loadeddata', handleVideoLoaded);
      };
    }
    
    return () => {
      videoRef.current?.removeEventListener('loadeddata', handleVideoLoaded);
    };
  }, [videoInfo.videoUrl]);
  
  // Código de incorporação para compartilhamento
  const embedCode = `<iframe src="https://dubsubai.com/embed/${id}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Código copiado!",
      description: "O código para incorporação foi copiado para a área de transferência.",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = async (type: string) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do vídeo não encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Download iniciado",
      description: `Seu download de ${type} começará em instantes.`,
    });
    
    try {
      let blob: Blob;
      let filename: string;
      
      switch (type) {
        case "vídeo com legenda":
          blob = await assemblyAiService.downloadVideo(id);
          filename = `${videoInfo.title.replace(/\s+/g, '_')}_legendado.mp4`;
          break;
        case "legendas SRT":
          blob = await assemblyAiService.downloadSubtitles(id, 'srt');
          filename = `${videoInfo.title.replace(/\s+/g, '_')}.srt`;
          break;
        case "legendas VTT":
          blob = await assemblyAiService.downloadSubtitles(id, 'vtt');
          filename = `${videoInfo.title.replace(/\s+/g, '_')}.vtt`;
          break;
        case "áudio dublado":
          blob = await assemblyAiService.downloadAudio(id);
          filename = `${videoInfo.title.replace(/\s+/g, '_')}_audio.mp3`;
          break;
        case "transcrição em TXT":
          blob = await assemblyAiService.downloadTranscription(id);
          filename = `${videoInfo.title.replace(/\s+/g, '_')}_transcricao.txt`;
          break;
        default:
          throw new Error(`Tipo de download não suportado: ${type}`);
      }
      
      // Criar URL do objeto e iniciar download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download concluído",
        description: `O arquivo ${filename} foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error(`Erro ao baixar ${type}:`, error);
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao baixar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleReprocess = () => {
    window.location.href = `/upload?video=${id}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to="/dashboard" className="text-brand-blue hover:underline text-sm">
                  Dashboard
                </Link>
                <span className="text-gray-500">›</span>
                <span className="text-sm text-gray-500">Resultado</span>
              </div>
              <h1 className="text-3xl font-bold">{videoInfo.title}</h1>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={handleReprocess}
              >
                Reprocessar
              </Button>
              <Link to="/dashboard">
                <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white">
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Video preview section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="relative bg-black pt-[56.25%]">
              {videoInfo.videoUrl ? (
                <video 
                  ref={videoRef}
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  poster={videoInfo.thumbnailUrl}
                  crossOrigin="anonymous"
                  preload="auto"
                >
                  <source src={videoInfo.videoUrl} type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  Carregando vídeo...
                </div>
              )}
              
              {/* Status da legenda */}
              {videoLoaded && loadingSubtitles && (
                <div className="absolute bottom-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-md text-sm">
                  Carregando legendas...
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <h4 className="text-sm text-gray-500">Idioma Original</h4>
                  <p className="font-medium">{videoInfo.originalLanguage}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Idioma Destino</h4>
                  <p className="font-medium">{videoInfo.targetLanguage}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Serviço</h4>
                  <p className="font-medium">{videoInfo.serviceType}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Duração</h4>
                  <p className="font-medium">{videoInfo.duration}</p>
                </div>
              </div>
              
              <Tabs defaultValue="download" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="download">Download</TabsTrigger>
                  <TabsTrigger value="share">Compartilhar</TabsTrigger>
                  <TabsTrigger value="transcript">Transcrição</TabsTrigger>
                </TabsList>
                
                <TabsContent value="download">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Vídeo com legenda</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Vídeo MP4 com legendas incorporadas
                      </p>
                      <Button 
                        className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white"
                        onClick={() => handleDownload("vídeo com legenda")}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Baixar MP4
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Legenda separada</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Arquivo de legenda para uso em players
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleDownload("legendas SRT")}
                        >
                          .SRT
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleDownload("legendas VTT")}
                        >
                          .VTT
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Áudio dublado</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Apenas a faixa de áudio traduzida
                      </p>
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDownload("áudio dublado")}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                        </svg>
                        Baixar MP3
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="share">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Link direto</h3>
                    <div className="flex gap-2">
                      <Input 
                        readOnly
                        value={`https://dubsubai.com/share/${id}`}
                        className="bg-gray-50 font-mono text-sm"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://dubsubai.com/share/${id}`);
                          toast({
                            title: "Link copiado!",
                            description: "O link foi copiado para a área de transferência.",
                          });
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Código para incorporação</h3>
                    <textarea 
                      readOnly 
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      value={embedCode}
                    />
                    <Button 
                      variant="outline"
                      className="mt-2"
                      onClick={handleCopyEmbed}
                    >
                      {copied ? "Copiado!" : "Copiar código"}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="transcript">
                  <div className="border rounded-md p-4 bg-gray-50 max-h-64 overflow-y-auto">
                    <p className="mb-2"><b>00:00:05</b> Olá a todos e bem-vindos a este tutorial.</p>
                    <p className="mb-2"><b>00:00:08</b> Hoje vamos aprender como legendar vídeos de forma profissional.</p>
                    <p className="mb-2"><b>00:00:12</b> Legendar vídeos é uma habilidade essencial para criadores de conteúdo.</p>
                    <p className="mb-2"><b>00:00:18</b> Primeiro, precisamos entender os diferentes formatos de legenda.</p>
                    <p className="mb-2"><b>00:00:25</b> Os mais comuns são SRT e VTT, cada um com suas próprias vantagens.</p>
                    <p className="mb-2"><b>00:00:32</b> O formato SRT é amplamente suportado pela maioria dos players de vídeo.</p>
                    <p className="mb-2"><b>00:00:38</b> Já o formato VTT oferece mais opções de estilização.</p>
                    <p className="mb-2"><b>00:00:45</b> Vamos agora ver como sincronizar as legendas corretamente.</p>
                    <p className="mb-2"><b>00:00:52</b> A sincronização é crucial para uma boa experiência do espectador.</p>
                    <p className="mb-2"><b>00:01:00</b> Legendas dessincronizadas podem prejudicar o entendimento do conteúdo.</p>
                    <p className="mb-2"><b>00:01:08</b> Existem diversas ferramentas que podem ajudar nesse processo.</p>
                    <p className="mb-2"><b>00:01:15</b> Uma delas é o Subtitle Edit, uma ferramenta gratuita e muito completa.</p>
                    <p className="mb-2"><b>00:01:23</b> Outra alternativa é o Aegisub, popular entre fansubbers.</p>
                    <p className="mb-2"><b>00:01:30</b> Agora vamos falar sobre boas práticas de legenda.</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={() => handleDownload("transcrição em TXT")}
                  >
                    Baixar transcrição (.txt)
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
