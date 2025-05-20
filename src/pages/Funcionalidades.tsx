import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Funcionalidades() {
  const featuresList = [
    {
      title: "Legendagem automática",
      description: "Gere legendas precisas para seus vídeos em mais de 50 idiomas usando tecnologia avançada de reconhecimento de fala.",
      icon: "🔤",
    },
    {
      title: "Dublagem com IA",
      description: "Transforme o áudio original em vozes naturais em qualquer idioma, com sincronia labial e emoções preservadas.",
      icon: "🎙️",
    },
    {
      title: "Reconhecimento de falantes",
      description: "Nosso sistema identifica diferentes falantes no vídeo e atribui cores distintas para melhor compreensão.",
      icon: "👥",
    },
    {
      title: "Exportação flexível",
      description: "Exporte seus projetos em vários formatos: SRT, VTT, MP4 com legendas embutidas ou apenas o áudio dublado.",
      icon: "💾",
    },
    {
      title: "Processamento em lote",
      description: "Agende múltiplos vídeos para processamento e receba notificações quando estiverem prontos.",
      icon: "📋",
    },
    {
      title: "Edição de legendas",
      description: "Ferramentas intuitivas para ajustar timing, texto e estilo das legendas antes da exportação final.",
      icon: "✏️",
    },
  ];

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto py-10 px-4">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-6">Funcionalidades</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            O DubSubAI oferece um conjunto completo de ferramentas para transformar seus vídeos com legendas e dublagens profissionais em diversos idiomas.
          </p>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Recursos principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feature, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Integrações de ponta</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-4">AssemblyAI</h3>
            <p className="mb-4">
              Utilizamos a API de transcrição de áudio da AssemblyAI para fornecer legendas precisas com reconhecimento avançado de fala.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Recursos incluídos:</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Detecção de idioma</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Identificação de falantes</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Pontuação automática</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
            <h3 className="text-xl font-medium mb-4">ElevenLabs</h3>
            <p className="mb-4">
              Para nossas dublagens, contamos com a tecnologia de síntese de voz da ElevenLabs, líder em vozes realistas em múltiplos idiomas.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Recursos incluídos:</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Múltiplas vozes</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Controle de entonação</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Sincronização labial</span>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
