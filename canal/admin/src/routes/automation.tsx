import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function AutomationDashboard() {
  const [activeTab, setActiveTab] = useState('social');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Growth & Automação (Fase 5)</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="social">Social Posts (IA)</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletters</TabsTrigger>
          <TabsTrigger value="jobs">Triagem de Vagas</TabsTrigger>
          <TabsTrigger value="brandbook">Brandbook & Assinaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Postagem Automatizada</CardTitle>
              <CardDescription>
                Utilize o roteador do LLM Llama-3 para gerar copys para suas redes e engatilhar o agendamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plataforma</Label>
                    <Select defaultValue="linkedin">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Instrução Base (O que divulgar?)</Label>
                    <Input placeholder="Resuma em poucas palavras o mote..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rascunho Inteligente Gerado</Label>
                  <Textarea placeholder="O post gerado pela inteligência aparecerá aqui..." className="min-h-[150px]" />
                </div>
                <Button>Gerar com IA</Button>
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline">Agendar</Button>
                  <Button>Publicar Agora</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas de Email</CardTitle>
              <CardDescription>Monte newsletters e dispare por double opt-in para a rede de contatos.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-dashed border-2 rounded">
              <div className="text-center text-muted-foreground">
                <p>Nenhuma campanha criada.</p>
                <Button className="mt-4" variant="outline">Nova Campanha</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Triagem de Candidatos</CardTitle>
              <CardDescription>Visão dos currículos submetidos, classificados automaticamente pela precisão com a vaga.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground p-4 bg-muted rounded">Nenhum candidato aguardando triagem.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="brandbook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerador de Assinaturas</CardTitle>
              <CardDescription>Gere assinaturas de email HTML com a marca do Tenant.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="outline">Baixar Assinatura HTML</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
