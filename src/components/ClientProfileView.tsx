import React, { useState } from 'react';
import { Client, Promo, ClientStatus } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Languages, 
  Award, 
  Coins, 
  Heart, 
  CheckCircle, 
  Lock, 
  Clock, 
  Plus, 
  Trash2,
  Gift
} from 'lucide-react';
import { motion } from 'motion/react';

interface ClientProfileViewProps {
  client: Client;
  allPromos: Promo[];
  onBack: () => void;
  onUpdateStatus: (clientId: string, status: ClientStatus) => void;
  onAdjustPoints: (clientId: string, amount: number) => void;
  onAssignPromo: (clientId: string, promoId: string) => void;
  onRemovePromo: (clientId: string, promoId: string) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  client,
  allPromos,
  onBack,
  onUpdateStatus,
  onAdjustPoints,
  onAssignPromo,
  onRemovePromo
}) => {
  const [selectedPromoId, setSelectedPromoId] = useState('');

  // Calculate tier status thresholds
  // Let's assume Silver Plus -> Gold at 50,000 points. Gold -> Platinum at 500,000 points.
  const getNextTierDetails = () => {
    if (client.tier === 'Silver Plus') {
      return { next: 'Gold Member', threshold: 50000, current: client.points, pct: Math.min((client.points / 50000) * 100, 100) };
    } else if (client.tier === 'Gold Member') {
      return { next: 'Platinum Elite', threshold: 500000, current: client.points, pct: Math.min((client.points / 500000) * 100, 100) };
    } else {
      return { next: 'MAX LIMIT', threshold: 1000000, current: client.points, pct: 100 };
    }
  };

  const nextTier = getNextTierDetails();

  const getTierBadgeStyle = (tier: string) => {
    switch(tier) {
      case 'Platinum Elite': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'Gold Member': return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30';
      case 'Silver Plus': return 'bg-slate-400/10 text-slate-300 border border-slate-400/30';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const handleAssign = () => {
    if (!selectedPromoId) return;
    onAssignPromo(client.id, selectedPromoId);
    setSelectedPromoId('');
  };

  // Get promos assigned to this specific client
  const assignedCampaigns = allPromos.filter(p => client.assignedPromos.includes(p.id));
  // Filter promos not already assigned
  const unassignedCampaigns = allPromos.filter(p => !client.assignedPromos.includes(p.id));

  return (
    <div id="client-profile-view" className="space-y-6 animate-fade-in text-slate-200">
      {/* Back Header Button */}
      <div id="profile-back-bar" className="flex items-center gap-3">
        <button
          id="btn-back-to-directory"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-[#0E1321] border border-[#1E293B] px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio</span>
        </button>
        <span className="text-slate-500 font-mono text-xs">/ Gestión de Ficha / {client.id}</span>
      </div>

      {/* Top Banner Cover */}
      <div id="profile-banner-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/[0.03] to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-5 items-center">
            {/* Main Avatar */}
            <img
              id="profile-big-avatar"
              src={client.avatar}
              alt={client.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              referrerPolicy="no-referrer"
            />
            
            <div className="text-center md:text-left">
              <h3 id="profile-full-name" className="text-xl font-bold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
                {client.name}
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  client.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {client.status}
                </span>
              </h3>
              <p id="profile-sub-id" className="text-xs text-slate-400 font-mono mt-1">ID Cliente: <span className="text-amber-400 font-semibold">{client.id}</span> • Ingreso: {client.joinDate}</p>
              
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-lg ${getTierBadgeStyle(client.tier)}`}>
                  {client.tier}
                </span>
                <span className="text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/10 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  {client.points.toLocaleString()} puntos
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-3 bg-[#131926] p-4 rounded-xl border border-[#1E293B]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAdjustPoints(client.id, -5000)}
                disabled={client.points < 5000}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold font-mono rounded-lg text-slate-300 disabled:opacity-40 transition-colors"
              >
                -5k pts
              </button>
              <button
                onClick={() => onAdjustPoints(client.id, 5000)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold font-mono rounded-lg text-slate-300 transition-colors"
              >
                +5k pts
              </button>
            </div>
            
            <button
              onClick={() => onUpdateStatus(client.id, client.status === 'Activo' ? 'Suspendido' : 'Activo')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                client.status === 'Activo' 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {client.status === 'Activo' ? 'Suspender Acceso' : 'Habilitar Acceso'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of details: Left (Info & Progress), Right (Promotions & Visits) */}
      <div id="profile-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Info & Progress */}
        <div className="lg:col-span-1 space-y-6">
          {/* Loyalty Level Progress */}
          <div id="loyalty-progress-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Progreso de Fidelización
            </h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Progreso a <span className="text-amber-400 font-semibold">{nextTier.next}</span></span>
                <span className="font-mono text-slate-300 font-bold">{nextTier.current.toLocaleString()} / {nextTier.threshold.toLocaleString()}</span>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${nextTier.pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {nextTier.next !== 'MAX LIMIT' 
                  ? `Faltan ${(nextTier.threshold - nextTier.current).toLocaleString()} puntos de juego para ascender al rango premium ${nextTier.next}.` 
                  : 'Este cliente ha alcanzado el nivel máximo de beneficios Platinum Elite.'}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div id="personal-info-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-500" /> Datos del Cliente VIP
            </h4>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/60 rounded-lg text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Email corporativo</p>
                  <p className="font-semibold mt-0.5">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/60 rounded-lg text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Teléfono directo</p>
                  <p className="font-semibold mt-0.5">{client.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/60 rounded-lg text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Fecha de Cumpleaños</p>
                  <p className="font-semibold mt-0.5">{client.birthDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/60 rounded-lg text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Procedencia / Origen</p>
                  <p className="font-semibold mt-0.5">{client.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/60 rounded-lg text-slate-400">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Idiomas de contacto</p>
                  <p className="font-semibold mt-0.5">{client.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences box */}
          <div id="preferences-box-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Preferencias de Juego y Consumo
            </h4>
            <div className="flex flex-wrap gap-2">
              {client.preferences.map((pref, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-[#131926] border border-[#1E293B] text-slate-200 rounded-xl text-xs font-medium hover:border-amber-500/20 transition-all cursor-default"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Promotions & Visit History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Promotional Engine Area */}
          <div id="client-promos-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" /> Promociones y Cupones Asignados
              </h4>

              {/* Assign Promo Selector form */}
              {unassignedCampaigns.length > 0 ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    id="select-assign-promo"
                    value={selectedPromoId}
                    onChange={(e) => setSelectedPromoId(e.target.value)}
                    className="bg-[#131926] border border-[#1E293B] text-xs text-slate-200 outline-none rounded-xl px-3 py-1.5 focus:border-amber-500 flex-1 sm:flex-initial"
                  >
                    <option value="">-- Seleccionar Campaña --</option>
                    {unassignedCampaigns.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button
                    id="btn-assign-promo-action"
                    onClick={handleAssign}
                    disabled={!selectedPromoId}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Asignar
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 italic">No hay más campañas disponibles</span>
              )}
            </div>

            {/* List of active assigned promos */}
            {assignedCampaigns.length > 0 ? (
              <div id="assigned-promos-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedCampaigns.map((promo) => (
                  <div 
                    key={promo.id} 
                    id={`assigned-promo-box-${promo.id}`}
                    className="p-4 bg-[#131926] border border-[#1E293B] hover:border-amber-500/20 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white leading-tight">{promo.name}</h5>
                      <p className="text-[10px] text-amber-500 font-mono mt-1 font-medium">Estado: {promo.status}</p>
                      <span className="text-[9px] text-slate-500 block mt-0.5">Vigencia: {promo.startDate} - {promo.endDate}</span>
                    </div>

                    <button
                      id={`btn-remove-promo-${promo.id}`}
                      onClick={() => onRemovePromo(client.id, promo.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Retirar Promoción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-[#131926]/40 border border-[#1E293B] rounded-xl">
                <p className="text-xs text-slate-500 italic">Este cliente no tiene cupones o promociones asignadas en este momento.</p>
              </div>
            )}
          </div>

          {/* Visit and Play History Logs */}
          <div id="visit-history-card" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Bitácora de Registro y Visitas VIP
            </h4>

            {client.visitHistory && client.visitHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111827] text-slate-400 border-b border-[#1E293B] uppercase tracking-wider text-[9px] font-bold">
                      <th className="p-3 pl-4">Fecha</th>
                      <th className="p-3">Actividad / Área</th>
                      <th className="p-3">Permanencia</th>
                      <th className="p-3">Puntos Sumados</th>
                      <th className="p-3 text-right pr-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {client.visitHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
                        <td className="p-3 pl-4 text-slate-400 font-medium font-mono">{item.date}</td>
                        <td className="p-3 font-semibold text-slate-200">{item.action}</td>
                        <td className="p-3 text-slate-400 font-mono">{item.duration}</td>
                        <td className="p-3 font-bold text-emerald-400 font-mono">+{item.points} pts</td>
                        <td className="p-3 text-right pr-4">
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                            <CheckCircle className="w-3 h-3" /> {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 bg-[#131926]/40 border border-[#1E293B] rounded-xl">
                <p className="text-xs text-slate-500 italic">No hay registros de visitas recientes en sala.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
