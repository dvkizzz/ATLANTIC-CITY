import React, { useState } from 'react';
import { Promo, EventItem, Client } from '../types';
import { 
  Award, 
  Calendar, 
  Compass, 
  MapPin, 
  Clock, 
  Plus, 
  Sparkles, 
  Users, 
  Play, 
  CheckCircle2, 
  X,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromotionsViewProps {
  promos: Promo[];
  events: EventItem[];
  clients: Client[];
  onAddPromo: (promo: Omit<Promo, 'id' | 'participants'>) => void;
  onRewardClient: (clientId: string, points: number) => void;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({
  promos,
  events,
  clients,
  onAddPromo,
  onRewardClient
}) => {
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [promoName, setPromoName] = useState('');
  const [promoType, setPromoType] = useState<'poker' | 'celebration' | 'liquor' | 'raffle' | 'parking'>('raffle');
  const [promoStart, setPromoStart] = useState('');
  const [promoEnd, setPromoEnd] = useState('');

  // Sorteo VIP Interactive State
  const [selectedPromoId, setSelectedPromoId] = useState(promos[0]?.id || '');
  const [isRaffling, setIsRaffling] = useState(false);
  const [raffleIndex, setRaffleIndex] = useState(0);
  const [winner, setWinner] = useState<Client | null>(null);

  const activeClients = clients.filter(c => c.status === 'Activo');

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName) return;

    onAddPromo({
      name: promoName,
      status: 'Activa',
      startDate: promoStart || 'Hoy',
      endDate: promoEnd || 'Sin Límite',
      type: promoType
    });

    setPromoName('');
    setPromoStart('');
    setPromoEnd('');
    setIsAddingPromo(false);
  };

  const handleStartRaffle = () => {
    if (activeClients.length === 0) return;
    setIsRaffling(true);
    setWinner(null);

    let count = 0;
    const interval = setInterval(() => {
      setRaffleIndex(Math.floor(Math.random() * activeClients.length));
      count++;
      
      // Stop after 25 ticks
      if (count > 25) {
        clearInterval(interval);
        const finalWinner = activeClients[Math.floor(Math.random() * activeClients.length)];
        setWinner(finalWinner);
        setIsRaffling(false);
        // Reward 10,000 points to the winner
        onRewardClient(finalWinner.id, 10000);
      }
    }, 100);
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'poker': return '♠️';
      case 'celebration': return '🎂';
      case 'liquor': return '🥃';
      case 'raffle': return '🎟️';
      case 'parking': return '🚗';
      default: return '🎁';
    }
  };

  return (
    <div id="promotions-view" className="space-y-8 animate-fade-in text-slate-200">
      {/* Sorteo VIP Interactive Raffler */}
      <div id="interactive-raffle-box" className="bg-[#0E1321] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/[0.04] to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-5 border-b border-[#1E293B] pb-4">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider uppercase">Sorteador Interactivo de Premios VIP</h3>
            <p className="text-xs text-slate-400">Selecciona una campaña de incentivo, inicia el simulador en vivo y premia a un socio activo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Controls column */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Campaña para el Sorteo</label>
              <select
                id="raffle-promo-select"
                value={selectedPromoId}
                onChange={(e) => setSelectedPromoId(e.target.value)}
                className="w-full bg-[#131926] border border-[#1E293B] text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-amber-500 outline-none cursor-pointer"
              >
                {promos.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <button
              id="btn-trigger-raffle"
              onClick={handleStartRaffle}
              disabled={isRaffling || activeClients.length === 0}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isRaffling ? 'Seleccionando Ganador...' : 'Iniciar Sorteo en Vivo'}</span>
            </button>
          </div>

          {/* Screen Visualizer Column */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-[#070A12] border border-[#1E293B] rounded-2xl p-6 min-h-48 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-[#111827]/60 to-[#070A12]/90 pointer-events-none" />
            
            {/* Spinning/Raffling Screen */}
            {isRaffling && activeClients[raffleIndex] && (
              <div id="raffle-spinner-visual" className="relative z-10 animate-pulse">
                <img
                  src={activeClients[raffleIndex].avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mx-auto object-cover border border-amber-500/40"
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-lg font-bold text-slate-200 mt-3 font-sans">{activeClients[raffleIndex].name}</h4>
                <p className="text-xs text-amber-500 font-mono font-bold mt-1 uppercase tracking-widest">{activeClients[raffleIndex].id}</p>
              </div>
            )}

            {/* Winner Declared Screen */}
            {!isRaffling && winner && (
              <motion.div 
                id="raffle-winner-declared"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 space-y-3"
              >
                <div className="relative inline-block">
                  <img
                    src={winner.avatar}
                    alt={winner.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full">
                    <Gift className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <div className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-0.5 inline-block font-bold tracking-widest uppercase mb-1">
                    🎉 ¡Ganador Elegido! 🎉
                  </div>
                  <h4 className="text-xl font-bold text-white">{winner.name}</h4>
                  <p className="text-xs text-slate-400">Código ID: <span className="text-amber-500 font-mono font-bold">{winner.id}</span></p>
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-4 py-2 font-semibold">
                  Acreditación Automática de <span className="font-bold">+10,000 pts</span> de Fidelización
                </div>
              </motion.div>
            )}

            {/* Waiting Screen */}
            {!isRaffling && !winner && (
              <div id="raffle-waiting-screen" className="relative z-10 text-slate-500 space-y-2">
                <Sparkles className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs font-semibold">Esperando inicio de sorteo...</p>
                <p className="text-[10px] text-slate-600">Premio: +10,000 puntos para canjes y accesos VIP</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Promotions and Calendar Events */}
      <div id="promos-and-calendar-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Promotions List & Add Campaign form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-white">Promociones y Campañas Activas</h3>
                <p className="text-xs text-slate-400">Administra los cupones y torneos que puedes otorgar.</p>
              </div>
              <button
                id="btn-toggle-add-campaign"
                onClick={() => setIsAddingPromo(!isAddingPromo)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Campaña
              </button>
            </div>

            {/* Add Promo Campaign Drawer */}
            {isAddingPromo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                id="add-promo-box"
                className="bg-[#131926] border border-amber-500/20 rounded-xl p-5 mb-6 text-xs space-y-4"
              >
                <h4 className="font-bold text-amber-400 uppercase tracking-wider">Registrar Campaña Premium</h4>
                <form onSubmit={handleAddCampaign} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Nombre de la Promoción *</label>
                    <input 
                      type="text" 
                      required
                      value={promoName}
                      onChange={(e) => setPromoName(e.target.value)}
                      placeholder="Ej. Torneo de Poker Black Edition" 
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Tipo de Promoción</label>
                    <select
                      value={promoType}
                      onChange={(e) => setPromoType(e.target.value as any)}
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
                    >
                      <option value="poker">♣️ Poker / Juego</option>
                      <option value="celebration">🎂 Celebración / Cumpleaños</option>
                      <option value="liquor">🥃 Bar & Lounge</option>
                      <option value="raffle">🎟️ Sorteo / Raffle</option>
                      <option value="parking">🚗 Valet Parking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Fecha de Inicio / Duración</label>
                    <input 
                      type="text" 
                      value={promoStart}
                      onChange={(e) => setPromoStart(e.target.value)}
                      placeholder="Ej. 01 Oct 2023" 
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Fecha de Cierre / Expiración</label>
                    <input 
                      type="text" 
                      value={promoEnd}
                      onChange={(e) => setPromoEnd(e.target.value)}
                      placeholder="Ej. 31 Oct 2023" 
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingPromo(false)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-slate-950 font-bold"
                    >
                      Guardar Campaña
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Promo list grid */}
            <div id="promos-list-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promos.map((promo) => (
                <div 
                  key={promo.id} 
                  id={`promo-card-${promo.id}`}
                  className="p-4 bg-[#131926] border border-[#1E293B] hover:border-slate-700 transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-slate-900 rounded-xl text-lg flex items-center justify-center border border-slate-800/80">
                        {getPromoIcon(promo.type)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 leading-snug">{promo.name}</h4>
                        <span className="text-[10px] text-slate-500 block mt-1 font-mono font-medium">Cierre: {promo.endDate}</span>
                      </div>
                    </div>
                    
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase font-mono ${
                      promo.status === 'Activa' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                    }`}>
                      {promo.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E293B] flex justify-between items-center text-[10px] text-slate-500 font-semibold font-mono">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {promo.participants} participantes
                    </span>
                    <span>Tipo: {promo.type.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Events Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white">Próximos Eventos VIP</h3>
              <p className="text-xs text-slate-400">Calendario de eventos exclusivos</p>
            </div>

            <div id="events-list-container" className="space-y-4 flex-1">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  id={`event-box-${event.id}`}
                  className="flex items-center gap-4 p-3.5 bg-[#131926]/50 border border-[#1E293B] rounded-xl hover:border-slate-700 transition-all"
                >
                  {/* Calendar Widget box */}
                  <div className="w-12 bg-[#1C2436] rounded-xl border border-[#334155]/60 text-center shrink-0 overflow-hidden shadow-inner">
                    <div className="bg-amber-500 text-slate-950 font-bold text-[9px] py-0.5 tracking-widest uppercase">{event.month}</div>
                    <div className="font-mono text-base font-bold py-1.5 text-white leading-none">{event.day}</div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100">{event.title}</h4>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E293B] text-center">
              <p className="text-[10px] text-slate-500">Eventos coordinados por el dpto. de Relaciones Públicas</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
