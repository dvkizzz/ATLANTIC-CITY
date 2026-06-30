import React, { useState } from 'react';
import { Client, Ticket, Activity, ActiveTab } from '../types';
import { 
  Users, 
  Calendar, 
  ShieldAlert, 
  Award, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  Flame,
  ArrowUpRight,
  UserPlus,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  clients: Client[];
  tickets: Ticket[];
  activities: Activity[];
  setActiveTab: (tab: ActiveTab) => void;
  onQuickRegisterClient: () => void;
  onQuickCreateTicket: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  clients, 
  tickets, 
  activities, 
  setActiveTab,
  onQuickRegisterClient,
  onQuickCreateTicket
}) => {
  // Compute metrics
  const activeClients = clients.filter(c => c.status === 'Activo').length;
  const pendingTicketsCount = tickets.filter(t => t.status === 'Pendiente').length;
  const totalPoints = clients.reduce((acc, c) => acc + c.points, 0);
  const totalVisits = clients.reduce((acc, c) => acc + c.visitsPerMonth, 0);

  // SVG Chart data
  const chartData = [
    { label: "Lun", visits: 45 },
    { label: "Mar", visits: 52 },
    { label: "Mié", visits: 49 },
    { label: "Jue", visits: 78 },
    { label: "Vie", visits: 110 },
    { label: "Sáb", visits: 145 },
    { label: "Dom", visits: 130 }
  ];

  const maxVisits = 160;
  const chartHeight = 160;
  const chartWidth = 500;

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; visits: number } | null>(null);

  // Generate SVG path for a smooth wave line
  const points = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (d.visits / maxVisits) * (chartHeight - 30) - 10;
    return { x, y, label: d.label, visits: d.visits };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const fillPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div id="dashboard-view" className="space-y-8 animate-fade-in">
      {/* 4 Cards Row */}
      <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <motion.div 
          whileHover={{ y: -4 }}
          id="kpi-card-clients"
          className="bg-[#0E1321] border border-[#1E293B] hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Clientes VIP Activos</span>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-sans">{activeClients}</span>
            <span className="text-xs text-slate-400">de {clients.length} total</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-emerald-400 text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>+5.4% esta semana</span>
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div 
          whileHover={{ y: -4 }}
          id="kpi-card-visits"
          className="bg-[#0E1321] border border-[#1E293B] hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Visitas Estimadas / Mes</span>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-sans">{totalVisits}</span>
            <span className="text-xs text-slate-400">promedio</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-emerald-400 text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>+12.1% mes anterior</span>
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div 
          whileHover={{ y: -4 }}
          id="kpi-card-tickets"
          className="bg-[#0E1321] border border-[#1E293B] hover:border-red-500/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Soporte VIP Pendiente</span>
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-sans">{pendingTicketsCount}</span>
            <span className="text-xs text-red-400 font-medium">Atención Inmediata</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-red-400 text-xs font-mono">
            <Flame className="w-4 h-4 text-red-500" />
            <span>SLA Crítico &lt; 30 min</span>
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div 
          whileHover={{ y: -4 }}
          id="kpi-card-points"
          className="bg-[#0E1321] border border-[#1E293B] hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">Créditos / Puntos Totales</span>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{(totalPoints / 1000).toFixed(1)}k</span>
            <span className="text-xs text-slate-400">loyalty pts</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-emerald-400 text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Fidelización fuerte</span>
          </div>
        </motion.div>
      </div>

      {/* Main Sections (Chart + Activity) */}
      <div id="dashboard-sections" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Chart & Quick Actions */}
        <div id="chart-and-actions-section" className="lg:col-span-2 space-y-8">
          {/* Chart Card */}
          <div id="visits-chart-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-white">Monitoreo de Visitas VIP</h3>
                <p className="text-xs text-slate-400">Frecuencia por días de la semana actual</p>
              </div>
              <div className="flex items-center gap-2 bg-[#131926] border border-[#1E293B] rounded-lg px-3 py-1 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Salas Platinum & Gold</span>
              </div>
            </div>

            {/* SVG Visualizer with real-time responsive simulation */}
            <div className="relative h-48 flex items-center justify-center bg-[#090D18]/60 rounded-xl p-4 overflow-hidden border border-[#1E293B]">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const y = 10 + i * ((chartHeight - 30) / 4);
                  return (
                    <line 
                      key={i} 
                      x1="20" 
                      y1={y} 
                      x2={chartWidth - 20} 
                      y2={y} 
                      stroke="#1e293b" 
                      strokeDasharray="4 4" 
                      strokeWidth="1" 
                    />
                  );
                })}

                {/* Gradient Fill */}
                <path d={fillPath} fill="url(#chart-grad)" />

                {/* Main Curve Line */}
                <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                {/* Data Points */}
                {points.map((p, index) => (
                  <circle
                    key={index}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.label === p.label ? "6" : "4"}
                    fill={hoveredPoint?.label === p.label ? "#ffffff" : "#f59e0b"}
                    stroke="#0b0f19"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPoint({
                        x: p.x,
                        y: p.y,
                        label: p.label,
                        visits: p.visits
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-slate-900 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-xl text-[11px] text-slate-100 z-10 pointer-events-none font-mono"
                  style={{
                    left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                    top: `${(hoveredPoint.y / chartHeight) * 100 - 45}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span className="font-semibold text-amber-400">{hoveredPoint.label}: </span>
                  {hoveredPoint.visits} visitas
                </div>
              )}
            </div>

            {/* Custom Legend Axis */}
            <div className="flex justify-between px-6 mt-3 text-[10px] text-slate-500 font-medium font-mono">
              {chartData.map((d, idx) => (
                <span key={idx}>{d.label}</span>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div id="quick-actions-panel" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">Acciones de Operación Rápida</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                id="action-btn-register"
                onClick={onQuickRegisterClient}
                className="flex flex-col items-start p-4 bg-[#131926] border border-[#1E293B] hover:border-amber-500/40 rounded-xl text-left transition-all duration-300 group hover:bg-amber-500/[0.01]"
              >
                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">Registrar VIP</span>
                <span className="text-[11px] text-slate-500 mt-1">Añadir cliente al sistema</span>
              </button>

              <button 
                id="action-btn-ticket"
                onClick={onQuickCreateTicket}
                className="flex flex-col items-start p-4 bg-[#131926] border border-[#1E293B] hover:border-red-500/40 rounded-xl text-left transition-all duration-300 group hover:bg-red-500/[0.01]"
              >
                <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400 mb-3 group-hover:scale-110 transition-transform animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">Crear Ticket</span>
                <span className="text-[11px] text-slate-500 mt-1">Reportar error de retiro</span>
              </button>

              <button 
                id="action-btn-roulette"
                onClick={() => setActiveTab('promotions')}
                className="flex flex-col items-start p-4 bg-[#131926] border border-[#1E293B] hover:border-emerald-500/40 rounded-xl text-left transition-all duration-300 group hover:bg-emerald-500/[0.01]"
              >
                <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">Sorteo VIP</span>
                <span className="text-[11px] text-slate-500 mt-1">Sorteo e incentivos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Activities Logs */}
        <div id="recent-activities-section" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Actividad Reciente</h3>
              <p className="text-xs text-slate-400">Logs de transacciones en vivo</p>
            </div>
            <button 
              id="view-all-activities"
              onClick={() => setActiveTab('clients')}
              className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
            >
              Clientes <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div id="activities-list-container" className="space-y-4 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {activities.map((act) => (
              <div 
                key={act.id} 
                id={`activity-row-${act.id}`}
                className="flex items-center justify-between p-3.5 bg-[#131926]/50 border border-[#1E293B] rounded-xl hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center font-bold text-xs ${act.clientColor}`}>
                    {act.clientInitials}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{act.clientName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.action}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    act.status === 'COMPLETADO' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                      : act.status === 'PROCESANDO'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                      : 'bg-red-500/10 text-red-400 border border-red-500/10'
                  }`}>
                    {act.status}
                  </span>
                  <div className="text-[10px] text-amber-500 font-semibold font-mono mt-1">{act.amount}</div>
                </div>
              </div>
            ))}
          </div>

          <div id="activities-footer" className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Última actualización: hace 3s</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Sincronizando logs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
