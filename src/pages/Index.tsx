import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              <span className="hero-gradient">Legende ou Duble.</span> <br />
              Sua escolha. Seu idioma.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transforme seus vídeos com legendas e dublagens de alta qualidade 
              usando tecnologia de inteligência artificial avançada.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white text-lg px-8 py-6">
                  Comece agora
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white text-lg px-8 py-6">
                  Conheça as funcionalidades
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 relative">
              <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-blue-50 to-transparent"></div>
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                <img 
                  src="https://via.placeholder.com/1200x600.png?text=Interface+do+DubSubAI" 
                  alt="Interface do DubSubAI" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Como funciona</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="step-item">
                <div className="step-number">1</div>
                <h3 className="font-semibold text-xl mb-2">Upload</h3>
                <p className="text-gray-600">
                  Faça upload de seu vídeo ou use um link do YouTube.
                </p>
              </div>
              
              <div className="step-item">
                <div className="step-number">2</div>
                <h3 className="font-semibold text-xl mb-2">Escolha</h3>
                <p className="text-gray-600">
                  Selecione legendagem, tradução ou dublagem em outro idioma.
                </p>
              </div>
              
              <div className="step-item">
                <div className="step-number">3</div>
                <h3 className="font-semibold text-xl mb-2">Processamento</h3>
                <p className="text-gray-600">
                  Nossa IA processa seu vídeo com precisão e qualidade.
                </p>
              </div>
              
              <div className="step-item">
                <div className="step-number">4</div>
                <h3 className="font-semibold text-xl mb-2">Download</h3>
                <p className="text-gray-600">
                  Baixe o resultado final ou compartilhe diretamente.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4 bg-blue-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Recursos principais</h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Nossa plataforma oferece soluções avançadas para tornar seus vídeos acessíveis e impactantes para audiências globais.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-3">Legendagem Precisa</h3>
                <p className="text-gray-600">
                  Transcrição automática de alta precisão com sincronização perfeita às falas.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-3">Tradução Inteligente</h3>
                <p className="text-gray-600">
                  Traduza suas legendas para mais de 50 idiomas mantendo o contexto original.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-3">Dublagem Natural</h3>
                <p className="text-gray-600">
                  Gere vozes naturais que sincronizam com seu vídeo em diferentes idiomas e estilos.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/features">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Veja todos os recursos
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">O que nossos clientes dizem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                name="Carlos Silva"
                role="Youtuber"
                content="O DubSubAI revolucionou meu canal. Agora posso criar conteúdo em português e disponibilizar para audiência internacional em questão de minutos."
                initials="CS"
              />
              
              <TestimonialCard 
                name="Ana Rodrigues"
                role="Professora Universitária"
                content="Uso o DubSubAI para legendar minhas aulas e disponibilizar para alunos internacionais. A precisão é impressionante e economizo horas de trabalho."
                initials="AR"
              />
              
              <TestimonialCard 
                name="Marcos Oliveira"
                role="Produtor de Conteúdo"
                content="A qualidade da dublagem é surpreendente. As vozes são naturais e a sincronização labial funciona muito bem. Melhor investimento para minha produtora."
                initials="MO"
              />
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 px-4 bg-brand-blue">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Pronto para expandir seu alcance global?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Comece hoje mesmo e transforme seus vídeos com legendas e dublagens profissionais.
            </p>
            <Link to="/register">
              <Button className="bg-white text-brand-blue hover:bg-gray-100 text-lg px-8 py-6">
                Criar conta gratuita
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
