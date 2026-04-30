import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DSARDashboard from "./dsar"
import ROPADashboard from "./ropa"
import IncidentsDashboard from "./incidents"

export default function ComplianceLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden fadeIn bg-background">
      <div className="flex-none px-6 md:px-12 py-8 flex border-b border-border/50 w-full min-w-0 bg-background z-10">
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto min-w-0">
          <div className="flex items-center justify-between w-full h-12">
            <div className="flex items-center gap-6">
               <h1 className="text-[22px] font-bold text-foreground">Compliance & Privacidade</h1>
               <span className="text-[14px] font-medium text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/50">Módulo DPO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 custom-scrollbar w-full min-w-0">
        <div className="max-w-[1400px] mx-auto min-w-0">
          <Tabs defaultValue="dsar" className="w-full">
            <div className="mb-8">
              <TabsList className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-1 rounded-full h-auto flex flex-wrap">
                <TabsTrigger value="dsar" className="rounded-full px-6 py-2 text-[13px] font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">DSAR (Pedidos LGPD)</TabsTrigger>
                <TabsTrigger value="ropa" className="rounded-full px-6 py-2 text-[13px] font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">ROPA (Inventário)</TabsTrigger>
                <TabsTrigger value="incidents" className="rounded-full px-6 py-2 text-[13px] font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">Security Incidents</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dsar" className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in zoom-in duration-500">
              <DSARDashboard />
            </TabsContent>
            
            <TabsContent value="ropa" className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in zoom-in duration-500">
              <ROPADashboard />
            </TabsContent>

            <TabsContent value="incidents" className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in zoom-in duration-500">
              <IncidentsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
