import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock data
  const users = [
    { id: 1, name: "João Silva", email: "joao@example.com", plan: "Pro", minutes: 74, joinDate: "2023-04-15" },
    { id: 2, name: "Maria Souza", email: "maria@example.com", plan: "Free", minutes: 3, joinDate: "2023-05-02" },
    { id: 3, name: "Carlos Santos", email: "carlos@example.com", plan: "Business", minutes: 280, joinDate: "2023-03-20" },
    { id: 4, name: "Ana Oliveira", email: "ana@example.com", plan: "Pro", minutes: 42, joinDate: "2023-05-05" },
    { id: 5, name: "Roberto Lima", email: "roberto@example.com", plan: "Free", minutes: 8, joinDate: "2023-05-08" },
  ];

  const videos = [
    { id: 1, title: "Como legendar vídeos profissionalmente", user: "João Silva", status: "ready", duration: "5:42", date: "2023-05-10" },
    { id: 2, name: "Tutorial de edição para iniciantes", user: "Maria Souza", status: "processing", duration: "12:31", date: "2023-05-09" },
    { id: 3, name: "Apresentação sobre IA", user: "Carlos Santos", status: "error", duration: "8:17", date: "2023-05-07" },
    { id: 4, name: "Reunião de equipe", user: "Ana Oliveira", status: "ready", duration: "32:10", date: "2023-05-05" },
    { id: 5, name: "Lançamento de produto", user: "Roberto Lima", status: "ready", duration: "18:22", date: "2023-05-01" },
  ];

  // Filter data based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics data
  const analytics = {
    totalUsers: 127,
    activeUsers: 89,
    totalVideos: 543,
    minutesProcessed: 12750,
    revenueMonth: 4890.50,
    popularLanguage: "Inglês",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-gray-600 mt-1">Gerencie usuários, vídeos e configurações do sistema</p>
            </div>
          </div>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Total e ativos no mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalUsers}</div>
                <p className="text-sm text-gray-500">
                  {analytics.activeUsers} ativos este mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Vídeos</CardTitle>
                <CardDescription>Total processado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalVideos}</div>
                <p className="text-sm text-gray-500">
                  {analytics.minutesProcessed} minutos processados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Receita</CardTitle>
                <CardDescription>Este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ {analytics.revenueMonth.toFixed(2)}</div>
                <p className="text-sm text-gray-500">
                  Idioma mais popular: {analytics.popularLanguage}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar por usuário, email ou vídeo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-6 py-3">Nome</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Plano</th>
                        <th className="px-6 py-3">Minutos</th>
                        <th className="px-6 py-3">Criado em</th>
                        <th className="px-6 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${user.plan === 'Free' ? 'bg-gray-100 text-gray-800' : user.plan === 'Pro' ? 'bg-brand-blue text-white' : 'bg-purple-100 text-purple-800'}`}
                            >
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">{user.minutes}</td>
                          <td className="px-6 py-4">{new Date(user.joinDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast({
                                  title: "Editar usuário",
                                  description: `Editar ${user.name}`
                                })}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => toast({
                                  title: "Excluir usuário",
                                  description: `Excluir ${user.name}`
                                })}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Nenhum usuário encontrado.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-6 py-3">Título</th>
                        <th className="px-6 py-3">Usuário</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Duração</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{video.title || video.name}</td>
                          <td className="px-6 py-4">{video.user}</td>
                          <td className="px-6 py-4">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${video.status === 'ready' ? 'bg-green-100 text-green-800' : video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {video.status === 'ready' ? 'Pronto' : video.status === 'processing' ? 'Processando' : 'Erro'}
                            </span>
                          </td>
                          <td className="px-6 py-4">{video.duration}</td>
                          <td className="px-6 py-4">{new Date(video.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast({
                                  title: "Ver vídeo",
                                  description: `Visualizar ${video.title || video.name}`
                                })}
                              >
                                Ver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => toast({
                                  title: "Excluir vídeo",
                                  description: `Excluir ${video.title || video.name}`
                                })}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredVideos.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Nenhum vídeo encontrado.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="plans">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Configurar Planos</h3>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Plano Free</h4>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Ativo</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minutos</label>
                        <Input type="number" defaultValue="10" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
                        <Input type="number" defaultValue="1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualidade máx.</label>
                        <select className="w-full h-10 px-3 border border-gray-300 rounded-md">
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                          <option value="4k">4K</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Plano Pro</h4>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Ativo</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minutos</label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
                        <Input type="number" defaultValue="10" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualidade máx.</label>
                        <select className="w-full h-10 px-3 border border-gray-300 rounded-md">
                          <option value="720p">720p</option>
                          <option value="1080p" selected>1080p</option>
                          <option value="4k">4K</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço mensal (R$)</label>
                        <Input type="number" defaultValue="49.90" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço anual (R$)</label>
                        <Input type="number" defaultValue="479.00" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Plano Business</h4>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Ativo</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minutos</label>
                        <Input type="text" defaultValue="Ilimitado" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
                        <Input type="text" defaultValue="Todos" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualidade máx.</label>
                        <select className="w-full h-10 px-3 border border-gray-300 rounded-md">
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                          <option value="4k" selected>4K</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço mensal (R$)</label>
                        <Input type="number" defaultValue="199.90" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço anual (R$)</label>
                        <Input type="number" defaultValue="1919.00" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white"
                    onClick={() => toast({
                      title: "Configurações salvas",
                      description: "As configurações dos planos foram atualizadas com sucesso."
                    })}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Enviar notificação</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de notificação</label>
                    <select className="w-full h-10 px-3 border border-gray-300 rounded-md">
                      <option>Todos os usuários</option>
                      <option>Usuários do plano Free</option>
                      <option>Usuários do plano Pro</option>
                      <option>Usuários do plano Business</option>
                      <option>Usuário específico</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <Input placeholder="Título da notificação" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      rows={4} 
                      placeholder="Digite sua mensagem aqui..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-notification" className="h-4 w-4 text-brand-blue" />
                    <label htmlFor="email-notification" className="text-sm font-medium text-gray-700">
                      Enviar também por email
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white"
                    onClick={() => toast({
                      title: "Notificação enviada",
                      description: "Sua notificação foi enviada com sucesso."
                    })}
                  >
                    Enviar notificação
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
