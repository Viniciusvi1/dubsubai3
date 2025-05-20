import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import DeleteVideoDialog from "@/components/DeleteVideoDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Define interface for video data
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  status: "ready" | "processing" | "error";
  duration: string;
  date: string;
  language: string;
  targetLanguage?: string;
  type: "subtitle" | "translation" | "dubbing";
}

const DEFAULT_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Como legendar vídeos profissionalmente",
    thumbnail: "https://via.placeholder.com/320x180.png?text=Video+1",
    status: "ready",
    duration: "5:42",
    date: "10 de maio, 2023",
    language: "Português",
    targetLanguage: "Inglês",
    type: "subtitle"
  },
  {
    id: "2",
    title: "Vídeo tutorial para iniciantes em edição",
    thumbnail: "https://via.placeholder.com/320x180.png?text=Video+2",
    status: "processing",
    duration: "12:31",
    date: "9 de maio, 2023",
    language: "Português",
    targetLanguage: "Espanhol",
    type: "dubbing"
  },
  {
    id: "3",
    title: "Apresentação sobre inteligência artificial",
    thumbnail: "https://via.placeholder.com/320x180.png?text=Video+3",
    status: "error",
    duration: "8:17",
    date: "7 de maio, 2023",
    language: "Português",
    type: "translation"
  },
  {
    id: "4",
    title: "Reunião de equipe - Planejamento Q2",
    thumbnail: "https://via.placeholder.com/320x180.png?text=Video+4",
    status: "ready",
    duration: "32:10",
    date: "5 de maio, 2023",
    language: "Português",
    targetLanguage: "Inglês",
    type: "subtitle"
  },
  {
    id: "5",
    title: "Lançamento de produto - Apresentação",
    thumbnail: "https://via.placeholder.com/320x180.png?text=Video+5",
    status: "ready",
    duration: "18:22",
    date: "1 de maio, 2023",
    language: "Português",
    targetLanguage: "Inglês",
    type: "dubbing"
  },
];

export default function Dashboard() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [videos, setVideos] = useState<Video[]>([]);
  const { isLoggedIn, checkAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Função para atualizar os vídeos periodicamente
  const refreshVideos = () => {
    const savedVideos = localStorage.getItem("userVideos");
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  };

  useEffect(() => {
    // Verificar se o usuário está logado
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      return;
    }

    // Carregar vídeos do localStorage
    const savedVideos = localStorage.getItem("userVideos");
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    } else {
      // Para usuários novos, não carregar os vídeos padrão
      localStorage.setItem("userVideos", JSON.stringify([]));
      setVideos([]);
    }

    // Configurar um intervalo para verificar atualizações dos vídeos a cada 3 segundos
    const intervalId = setInterval(refreshVideos, 3000);

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [checkAuth, navigate, toast]);

  // Filter videos based on status
  const filteredVideos = videos.filter((video) => {
    if (filter === "all") return true;
    return video.status === filter;
  });

  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "date") {
      // Converter para formato de data brasileiro para inglês para comparação
      const dateA = a.date.split(' de ');
      const dateB = b.date.split(' de ');
      const dateStringA = `${dateA[0]} ${dateA[1]} ${dateA[2]}`;
      const dateStringB = `${dateB[0]} ${dateB[1]} ${dateB[2]}`;
      return new Date(dateStringB).getTime() - new Date(dateStringA).getTime();
    } else if (sortBy === "duration") {
      const aDuration = parseInt(a.duration.split(":")[0]) * 60 + parseInt(a.duration.split(":")[1] || "0");
      const bDuration = parseInt(b.duration.split(":")[0]) * 60 + parseInt(b.duration.split(":")[1] || "0");
      return bDuration - aDuration;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const handleDeleteVideo = (videoId: string) => {
    const updatedVideos = videos.filter(video => video.id !== videoId);
    setVideos(updatedVideos);
    localStorage.setItem("userVideos", JSON.stringify(updatedVideos));
    
    toast({
      title: "Vídeo excluído",
      description: "O vídeo foi excluído com sucesso.",
    });
  };

  // Minutes left calculation
  const minutesLeft = 74;
  const totalMinutes = 100;
  const percentUsed = (minutesLeft / totalMinutes) * 100;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Acesso restrito</h1>
            <p className="mb-6">Você precisa estar logado para acessar esta página.</p>
            <Link to="/login">
              <Button>Fazer login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Bem-vindo ao seu Dashboard</h1>
              <p className="text-gray-600 mt-1">Gerencie seus vídeos e projetos de legendagem</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link to="/upload">
                <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Enviar Novo Vídeo
                </Button>
              </Link>
            </div>
          </div>

          {/* Minutes usage card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Uso de Minutos</h3>
                <p className="text-gray-600">Seu plano atual: <span className="font-medium">Gratuito</span></p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <div>
                  <span className="text-2xl font-bold">{minutesLeft}</span>
                  <span className="text-gray-500">/{totalMinutes} minutos</span>
                </div>
                <Link to="/pricing" className="ml-4">
                  <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                    Fazer upgrade
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-blue" 
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </div>
          
          {/* Videos section */}
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="videos">Meus Vídeos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="shared">Compartilhados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Status:</span>
                  <Select 
                    value={filter} 
                    onValueChange={setFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="processing">Em processamento</SelectItem>
                      <SelectItem value="ready">Pronto</SelectItem>
                      <SelectItem value="error">Com erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Ordenar:</span>
                  <Select 
                    value={sortBy} 
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Data (recente)</SelectItem>
                      <SelectItem value="title">Nome (A-Z)</SelectItem>
                      <SelectItem value="duration">Duração (maior)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {sortedVideos.length > 0 ? (
                <div className="space-y-4">
                  {sortedVideos.map((video) => (
                    <div key={video.id} className="flex flex-col md:flex-row justify-between bg-white rounded-lg border border-gray-200 p-4">
                      <VideoCard {...video} />
                      <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
                        <DeleteVideoDialog
                          videoId={video.id}
                          videoTitle={video.title}
                          onDeleteSuccess={() => handleDeleteVideo(video.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                  </svg>
                  <h3 className="text-xl font-medium mb-2">Nenhum vídeo encontrado</h3>
                  <p className="text-gray-500 mb-6">Você ainda não tem vídeos com esse status.</p>
                  <Link to="/upload">
                    <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white">
                      Enviar seu primeiro vídeo
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhum favorito ainda</h3>
                <p className="text-gray-500">Marque vídeos como favoritos para encontrá-los mais facilmente.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="shared">
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhum vídeo compartilhado</h3>
                <p className="text-gray-500">Vídeos compartilhados com você aparecerão aqui.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
