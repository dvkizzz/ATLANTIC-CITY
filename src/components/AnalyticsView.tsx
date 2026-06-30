import React, { useState } from 'react';
import { Client, Promo } from '../types';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Award, 
  Sparkles, 
  PieChart, 
  ArrowUpRight, 
  Clock,
  Zap,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsViewProps {
  clients: Client[];
  promos: Promo[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ clients, promos }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportReady, setReportReady] = useState(false);

  // Stats computation
  const totalPoints = clients.reduce((acc, c) => acc + c.points, 0);
  const avgPoints = clients.length > 0 ? Math.round(totalPoints / clients.length) : 0;
  const platinumCount = clients.filter(c => c.tier === 'Platinum Elite').length;
  const goldCount = clients.filter(c => c.tier === 'Gold Member').length;
  const silverCount = clients.filter(c => c.tier === 'Silver Plus').length;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportReady(false);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setReportReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // High quality SVG bar chart dimensions
  const svgWidth = 400;
  const svgHeight = 160;
  const tierData = [
    { name: "Silver Plus", count: silverCount, color: "#94a3b8" },
    { name: "Gold Member", count: goldCount, color: "#eab308" },
    { name: "Platinum Elite", count: platinumCount, color: "#f59e0b" }
  ];
  const maxCount = Math.max(...tierData.map(d => d.count), 1);

  return (
    <div id="analytics-view" className="space-y-8 animate-fade-in text-slate-200">
      {/* 3 Analytics Overview Cards */}
      <div id="analytics-overview-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Promedio de Fidelidad</span>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/10">
              <CoinsIcon className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">{avgPoints.toLocaleString()} pts</h3>
          <p className="text-[11px] text-slate-400 mt-2">Puntos acumulados promedio por cliente activo</p>
        </div>

        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasa de Conversión</span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">72.4%</h3>
          <p className="text-[11px] text-slate-400 mt-2">Redención exitosa de códigos de regalo</p>
        </div>

        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eficiencia de Respuesta</span>
            <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/10">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">94.8%</h3>
          <p className="text-[11px] text-slate-400 mt-2">Cumplimiento del SLA dentro de los 30 min</p>
        </div>
      </div>

      {/* Charts & Interactive Simulator */}
      <div id="analytics-charts-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - High-fidelity Distribution Chart */}
        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Distribución por Tier de Clientes</h3>
              <p className="text-xs text-slate-400">Total de socios categorizados por rango</p>
            </div>
            <span className="text-xs text-amber-500 font-mono font-bold">Total: {clients.length}</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 bg-[#090D18]/60 rounded-xl p-4 flex items-center justify-center border border-[#1E293B]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              {tierData.map((d, i) => {
                const barWidth = 40;
                const gap = 80;
                const x = 50 + i * (barWidth + gap);
                const height = (d.count / maxCount) * (svgHeight - 60);
                const y = svgHeight - height - 30;

                return (
                  <g key={i} className="group cursor-pointer">
                    {/* Background faint guide bar */}
                    <rect 
                      x={x} 
                      y={10} 
                      width={barWidth} 
                      height={svgHeight - 40} 
                      fill="#1e293b" 
                      opacity="0.15" 
                      rx="4"
                    />
                    
                    {/* Active Count Bar */}
                    <motion.rect
                      initial={{ height: 0, y: svgHeight - 30 }}
                      animate={{ height, y }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      x={x}
                      width={barWidth}
                      fill={d.color}
                      rx="4"
                    />

                    {/* Count Text overlay */}
                    <text 
                      x={x + barWidth / 2} 
                      y={y - 8} 
                      fill="#f8fafc" 
                      fontSize="11" 
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {d.count}
                    </text>

                    {/* Label Axis */}
                    <text 
                      x={x + barWidth / 2} 
                      y={svgHeight - 10} 
                      fill="#94a3b8" 
                      fontSize="10" 
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {d.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
              {/* Bottom base border line */}
              <line x1="10" y1={svgHeight - 25} x2={svgWidth - 10} y2={svgHeight - 25} stroke="#334155" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Right Column - Simulated Report Downloader */}
        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Exportador y Reportes Ejecutivos</h3>
            <p className="text-xs text-slate-400 mb-5">Genera un análisis consolidado en PDF o formato compatible de hoja de cálculo.</p>
          </div>

          <div className="bg-[#131926]/40 p-5 border border-[#1E293B] rounded-xl flex-1 flex flex-col items-center justify-center min-h-36 text-center">
            {isGenerating && (
              <div id="generating-report-progress" className="space-y-4 w-full max-w-xs">
                <RefreshCw className="w-8 h-8 mx-auto text-amber-500 animate-spin" />
                <div>
                  <p className="text-xs text-slate-300 font-semibold">Generando Reporte de Operaciones...</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{generationProgress}% consolidado</p>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-500" style={{ width: `${generationProgress}%` }} />
                </div>
              </div>
            )}

            {!isGenerating && reportReady && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                id="report-success-panel" 
                className="space-y-3"
              >
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-full inline-block border border-emerald-500/20">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-100">Reporte Consolidado Generado Exitosamente</h4>
                <p className="text-[11px] text-slate-400">Incluye auditoría de puntos, logs de soporte técnico e incentivos VIP.</p>
                
                <div className="flex justify-center gap-3 pt-2">
                  <a
                    href="#download-pdf"
                    onClick={(e) => { e.preventDefault(); alert("Simulación de descarga de Reporte de Clientes VIP (PDF)"); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded-lg transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar PDF
                  </a>
                  <a
                    href="#download-csv"
                    onClick={(e) => { e.preventDefault(); alert("Simulación de descarga de logs consolidados (CSV)"); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] rounded-lg transition-all border border-slate-700"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Descargar CSV
                  </a>
                </div>
              </motion.div>
            )}

            {!isGenerating && !reportReady && (
              <div id="report-idle-panel" className="space-y-3 text-slate-500">
                <BarChart3 className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs font-medium">No se registran exportes activos en esta sesión.</p>
                <button
                  id="btn-trigger-report-generation"
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Generar Reporte Completo
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* AI Recommendation Panel segments */}
      <div id="ai-recom-card" className="bg-[#0E1321] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/[0.03] to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recomendaciones Inteligentes de Segmentación</h3>
            <p className="text-xs text-slate-400">Modelos predictivos que analizan el comportamiento en salas de juego y canjes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-4 bg-[#131926]/50 border border-[#1E293B] rounded-xl space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
              <Zap className="w-4 h-4 text-amber-400" /> Campañas de Fidelidad para Arequipa
            </h4>
            <p className="leading-relaxed text-slate-400">
              Se ha detectado un incremento del <span className="text-emerald-400 font-semibold">+18.5%</span> de visitas en el segmento Platinum de Arequipa. Recomendamos asignar la promoción <span className="text-slate-200 font-medium font-mono">After Office Cocktails 2x1</span> para optimizar la retención y el consumo de mesas.
            </p>
          </div>

          <div className="p-4 bg-[#131926]/50 border border-[#1E293B] rounded-xl space-y-2">
            <h4 className="font-bold text-red-400 flex items-center gap-1.5 uppercase text-[11px]">
              <TrendingUp className="w-4 h-4 text-red-400" /> Alerta de Inactividad de Sebastián Thorne
            </h4>
            <p className="leading-relaxed text-slate-400">
              El cliente <span className="text-slate-200 font-medium">Sebastián Thorne</span> (Silver Plus, Suspendido) no registra ingresos en las salas desde hace 45 días. Tasa predictiva de Churn del <span className="text-red-400 font-semibold font-mono">14.2%</span>. Se sugiere contactar a través del Concierge VIP con un pase de estacionamiento gratuito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple loyalty coins icon wrapper
const CoinsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
