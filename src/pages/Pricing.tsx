import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
  
  const handleSelectPlan = (plan: string) => {
    toast({
      title: `Plano ${plan} selecionado`,
      description: "Você será redirecionado para o checkout.",
    });
    
    // In a real implementation, this would redirect to Stripe checkout
    setTimeout(() => {
      window.location.href = "/register";
    }, 1500);
  };
  
  const basicFeatures = [
    { text: "10 minutos/mês", included: true },
    { text: "1 idioma para tradução", included: true },
    { text: "Legendas em formato SRT", included: true },
    { text: "Qualidade de vídeo até 720p", included: true },
    { text: "5 projetos simultâneos", included: true },
    { text: "Suporte por email", included: true },
    { text: "Múltiplos idiomas", included: false },
    { text: "Exportação em alta resolução", included: false },
  ];
  
  const proFeatures = [
    { text: "100 minutos/mês", included: true },
    { text: "Múltiplos idiomas", included: true },
    { text: "Legendas em SRT e VTT", included: true },
    { text: "Qualidade de vídeo até 1080p", included: true },
    { text: "20 projetos simultâneos", included: true },
    { text: "Suporte prioritário", included: true },
    { text: "API de integração", included: true },
    { text: "Processamento em lote", included: false },
  ];
  
  const businessFeatures = [
    { text: "Minutos ilimitados", included: true },
    { text: "Todos os idiomas disponíveis", included: true },
    { text: "Todos os formatos de legenda", included: true },
    { text: "Qualidade de vídeo até 4K", included: true },
    { text: "Projetos ilimitados", included: true },
    { text: "Suporte dedicado 24/7", included: true },
    { text: "API completa", included: true },
    { text: "Processamento em lote", included: true },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Planos flexíveis para atender suas necessidades, desde projetos pequenos até demandas empresariais.
            </p>
            
            {/* Toggle between Monthly and Yearly */}
            <div className="flex justify-center items-center mt-8">
              <span className={`mr-3 ${billing === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Mensal
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={billing === 'yearly'} 
                  onChange={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
              <span className={`ml-3 ${billing === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Anual
              </span>
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Economize 20%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              title="Gratuito"
              price="Gratuito"
              description="Perfeito para testar a plataforma e projetos pessoais pequenos."
              features={basicFeatures}
              buttonText="Começar grátis"
              onSelectPlan={() => handleSelectPlan('Gratuito')}
            />
            
            <PricingCard 
              title="Pro"
              price={billing === "monthly" ? "R$ 49,90" : "R$ 479,00"}
              description="Ideal para criadores de conteúdo e pequenos negócios."
              features={proFeatures}
              popular={true}
              buttonText="Assinar agora"
              onSelectPlan={() => handleSelectPlan('Pro')}
            />
            
            <PricingCard 
              title="Empresa"
              price={billing === "monthly" ? "R$ 199,90" : "R$ 1.919,00"}
              description="Para empresas com alto volume de processamento de vídeos."
              features={businessFeatures}
              buttonText="Fale conosco"
              onSelectPlan={() => handleSelectPlan('Empresa')}
            />
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">O que acontece quando meus minutos acabam?</h3>
                <p className="text-gray-600">
                  Quando seus minutos acabam, você pode comprar créditos adicionais ou fazer upgrade para um plano com mais minutos.
                  Seu conteúdo continuará acessível, mas você não poderá processar novos vídeos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Posso mudar de plano a qualquer momento?</h3>
                <p className="text-gray-600">
                  Sim, você pode fazer upgrade a qualquer momento e seu novo plano será ativado imediatamente.
                  Para downgrade, a mudança ocorrerá no próximo ciclo de faturamento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Como é calculado o uso de minutos?</h3>
                <p className="text-gray-600">
                  O uso de minutos é calculado com base na duração do vídeo original. 
                  Se seu vídeo tem 5 minutos, serão descontados 5 minutos do seu plano, independente do tipo de processamento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Quais idiomas são suportados?</h3>
                <p className="text-gray-600">
                  No plano gratuito, oferecemos suporte a português e inglês. Os planos pagos incluem mais de 50 idiomas,
                  incluindo espanhol, francês, alemão, italiano, japonês, entre outros.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-gray-600">
                  Sim, você pode cancelar sua assinatura a qualquer momento. Se você cancelar, poderá usar o serviço
                  até o final do seu ciclo de faturamento atual.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Existe alguma restrição de tamanho para os vídeos?</h3>
                <p className="text-gray-600">
                  Sim, o tamanho máximo de arquivo é de 500MB para uploads diretos. Para vídeos maiores,
                  recomendamos usar um link do YouTube ou entrar em contato com nosso suporte.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-20 bg-brand-blue rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
            <p className="text-xl mb-6 max-w-xl mx-auto">
              Entre em contato com nossa equipe de suporte para obter ajuda ou saber mais sobre nossos planos e preços.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-white text-brand-blue hover:bg-gray-100">
                Agendar demonstração
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue">
                Falar com o suporte
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
