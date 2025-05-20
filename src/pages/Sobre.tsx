import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Sobre() {
  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-6">Sobre nós</h1>
        
        <section className="mb-10">
          <p className="text-lg text-gray-700 leading-relaxed">
            O DubSubAI é uma plataforma de inteligência artificial desenvolvida para transformar vídeos por meio de legendagem e dublagem automática em diversos idiomas. Nosso objetivo é tornar o conteúdo mais acessível, inclusivo e impactante para audiências globais.
          </p>
          <p className="mt-4 text-gray-700">
            Acreditamos na união entre tecnologia e simplicidade. Criamos soluções que permitem que qualquer pessoa, empresa ou criador de conteúdo comunique sua mensagem de forma clara, envolvente e multilíngue.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Nossa história</h2>
          <p className="text-gray-700 mb-4">
            Fundada em 2023, a DubSubAI nasceu da necessidade de democratizar a produção de conteúdo multilíngue. Nossa fundadora, Ana Silva, enfrentou desafios ao tentar expandir seu canal de vídeos para audiências internacionais e percebeu que as ferramentas existentes eram caras e complexas.
          </p>
          <p className="text-gray-700">
            Com uma equipe multidisciplinar de engenheiros, linguistas e especialistas em mídia, desenvolvemos uma plataforma que torna o processo de legendagem e dublagem acessível a todos, desde criadores individuais até grandes empresas.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
