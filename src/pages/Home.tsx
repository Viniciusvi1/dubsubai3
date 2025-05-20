import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto py-10 px-4">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-2">Legende ou Duble. Sua escolha. Seu idioma.</h2>
          <p className="text-gray-600 mt-2">A plataforma inteligente para legendagem e dublagem de vídeos com IA.</p>
          <Link to="/funcionalidades" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
            Conheça as funcionalidades
          </Link>
        </section>

        <section id="funcionalidades" className="mb-20">
          <h3 className="text-3xl font-semibold mb-6">Funcionalidades</h3>
          <ul className="space-y-4 text-gray-700">
            <li>✅ Legenda automática com suporte a múltiplos idiomas</li>
            <li>✅ Dublagem com vozes masculinas e femininas realistas</li>
            <li>✅ Reconhecimento de múltiplos falantes</li>
            <li>✅ Exportação em .srt, .mp4, ou apenas áudio</li>
            <li>✅ Agendamento de tarefas em lote</li>
          </ul>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
