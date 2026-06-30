import React, { useState } from 'react';
import { Client, ClientTier, ClientStatus } from '../types';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Coins, 
  ChevronRight, 
  Phone,
  Settings,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface ClientsViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onUpdateClientStatus: (clientId: string, status: ClientStatus) => void;
  onAdjustPoints: (clientId: string, amount: number) => void;
  onRegisterClient: (newClient: Omit<Client, 'id' | 'joinDate' | 'assignedPromos' | 'visitHistory'>) => void;
  searchQuery: string;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ 
  clients, 
  onSelectClient, 
  onUpdateClientStatus,
  onAdjustPoints,
  onRegisterClient,
  searchQuery
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tierFilter, setTierFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    tier: 'Silver Plus' as ClientTier,
    points: 0,
    visitsPerMonth: 2,
    location: '',
    languages: 'Español',
    preferences: ''
  });

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = tierFilter === 'todos' || client.tier === tierFilter;
    const matchesStatus = statusFilter === 'todos' || client.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    onRegisterClient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "+51 900 000 000",
      birthDate: formData.birthDate || "01 de Enero, 1990",
      status: "Activo",
      tier: formData.tier,
      points: Number(formData.points) || 0,
      visitsPerMonth: Number(formData.visitsPerMonth) || 2,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCws4SEl0OoPru6qFQmkXVxKBL4TasWWtmiNpov3cfuTMrbWKBUlk5ENqCrTdjI0p-XvOWL9oKaEbiE-3TwTgi5HwGtj7b2V1rTUH9B2EpcYoaREjttVgzY-Sdz4uaHREI5YxvXAMJbV8NIl8eug9OII68XnOff5oQOz12NTT-myJDQFZT6krMNiC3LKO1gCW8uQsvGpuBPvEx1_JEaNx1vee5ZLNzPKvyRRmFMwXb4Fgsek7PABOPoR_AjP8A4VxAeTEfwuHFpaK3I",
      location: formData.location || "Lima, Perú",
      languages: formData.languages.split(',').map(s => s.trim()),
      preferences: formData.preferences ? formData.preferences.split(',').map(s => s.trim()) : ["Mesa Standard"]
    });

    setIsRegistering(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      tier: 'Silver Plus',
      points: 0,
      visitsPerMonth: 2,
      location: '',
      languages: 'Español',
      preferences: ''
    });
  };

  const getTierColor = (tier: ClientTier) => {
    switch (tier) {
      case 'Platinum Elite': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'Gold Member': return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30';
      case 'Silver Plus': return 'bg-slate-400/10 text-slate-300 border border-slate-400/30';
    }
  };

  return (
    <div id="clients-view-container" className="space-y-6">
      {/* Search & Filter Header controls */}
      <div id="clients-controls-bar" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div id="filters-controls" className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Tier filter selector */}
          <div className="flex items-center gap-2 bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <select 
              id="select-filter-tier"
              value={tierFilter} 
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer font-medium"
            >
              <option value="todos" className="bg-[#131926] text-slate-100">Todos los Rangos</option>
              <option value="Platinum Elite" className="bg-[#131926] text-slate-100">Platinum Elite</option>
              <option value="Gold Member" className="bg-[#131926] text-slate-100">Gold Member</option>
              <option value="Silver Plus" className="bg-[#131926] text-slate-100">Silver Plus</option>
            </select>
          </div>

          {/* Status filter selector */}
          <div className="flex items-center gap-2 bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-1.5">
            <Filter className="w-4 h-4 text-emerald-500" />
            <select 
              id="select-filter-status"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer font-medium"
            >
              <option value="todos" className="bg-[#131926]">Todos los Estados</option>
              <option value="Activo" className="bg-[#131926]">Activo</option>
              <option value="Suspendido" className="bg-[#131926]">Suspendido</option>
            </select>
          </div>
        </div>

        {/* Layout controls & Register Action */}
        <div id="layout-and-action-controls" className="flex items-center gap-3 justify-end w-full md:w-auto">
          {/* Toggle Grid/List */}
          <div className="flex items-center bg-[#131926] border border-[#1E293B] p-1.5 rounded-xl">
            <button
              id="btn-view-grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              id="btn-view-list"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New VIP button */}
          <button
            id="btn-register-new-vip"
            onClick={() => setIsRegistering(!isRegistering)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir VIP</span>
          </button>
        </div>
      </div>

      {/* Dynamic Drawer/Form if adding VIP */}
      {isRegistering && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          id="registration-drawer"
          className="bg-[#0E1321] border border-amber-500/30 rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Registro de Nuevo Cliente VIP
          </h3>
          <form id="new-vip-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Nombre Completo *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej. Alessandra Mancini" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Correo Electrónico *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Ej. a.mancini@corporate.com" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Teléfono Celular</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Ej. +51 984 321 098" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Cumpleaños / Fecha Nacimiento</label>
              <input 
                type="text" 
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                placeholder="Ej. 12 de Agosto, 1990" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Rango / Tier Elite</label>
              <select 
                value={formData.tier}
                onChange={(e) => setFormData({...formData, tier: e.target.value as ClientTier})}
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
              >
                <option value="Platinum Elite">Platinum Elite</option>
                <option value="Gold Member">Gold Member</option>
                <option value="Silver Plus">Silver Plus</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Ubicación / Procedencia</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ej. Lima, Perú o Milán" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Idiomas (separados por coma)</label>
              <input 
                type="text" 
                value={formData.languages}
                onChange={(e) => setFormData({...formData, languages: e.target.value})}
                placeholder="Ej. Español, Inglés, Italiano" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Créditos de Entrada</label>
              <input 
                type="number" 
                value={formData.points}
                onChange={(e) => setFormData({...formData, points: Number(e.target.value)})}
                placeholder="Ej. 10000" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Preferencias VIP (separadas por coma)</label>
              <input 
                type="text" 
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                placeholder="Ej. Poker Texas, Whisky Malt" 
                className="w-full bg-[#131926] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-xs font-bold rounded-xl text-slate-950 transition-colors"
              >
                Guardar Cliente
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid Mode Display */}
      {viewMode === 'grid' ? (
        <div id="clients-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <motion.div
              layout
              id={`client-card-${client.id}`}
              key={client.id}
              whileHover={{ y: -4 }}
              className="bg-[#0E1321] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Card Header Background with status indicator */}
              <div className="bg-gradient-to-r from-[#111827] to-[#131B2E] p-5 border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#334155]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">{client.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{client.id}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                  client.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${client.status === 'Activo' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {client.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* Tier details & loyalty */}
                <div className="flex justify-between items-center text-[11px]">
                  <span className={`px-2.5 py-1 rounded-lg font-semibold ${getTierColor(client.tier)}`}>
                    {client.tier}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{client.points.toLocaleString()} pts</span>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-2 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{client.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                {/* Preference tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {client.preferences.slice(0, 3).map((pref, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 text-[10px] border border-slate-700/30">
                      {pref}
                    </span>
                  ))}
                  {client.preferences.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">+{client.preferences.length - 3}</span>
                  )}
                </div>

                {/* Point Modifier Controls & Detailed Inspection */}
                <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-[#131926] p-1 rounded-lg border border-[#1E293B]">
                    <button
                      onClick={() => onAdjustPoints(client.id, -1000)}
                      disabled={client.points < 1000}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold font-mono rounded text-slate-300 disabled:opacity-40 transition-colors"
                    >
                      -1k
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono font-bold px-1">Puntos</span>
                    <button
                      onClick={() => onAdjustPoints(client.id, 1000)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold font-mono rounded text-slate-300 transition-colors"
                    >
                      +1k
                    </button>
                  </div>

                  <button
                    id={`btn-inspect-client-${client.id}`}
                    onClick={() => onSelectClient(client)}
                    className="flex items-center gap-1 text-amber-500 hover:text-amber-400 text-[11px] font-bold transition-all shrink-0"
                  >
                    <span>Ficha</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status Toggle Switch */}
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span>Acción rápida</span>
                  <button
                    onClick={() => onUpdateClientStatus(client.id, client.status === 'Activo' ? 'Suspendido' : 'Activo')}
                    className={`font-semibold hover:underline ${client.status === 'Activo' ? 'text-red-400' : 'text-emerald-400'}`}
                  >
                    {client.status === 'Activo' ? 'Suspender Acceso' : 'Habilitar Acceso'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List Mode Display */
        <div id="clients-list-container" className="bg-[#0E1321] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111827] text-slate-400 border-b border-[#1E293B] uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-4 pl-6">Cliente VIP</th>
                  <th className="p-4">Código ID</th>
                  <th className="p-4">Rango / Tier</th>
                  <th className="p-4">Ubicación</th>
                  <th className="p-4">Fidelidad</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    id={`client-list-row-${client.id}`}
                    className="hover:bg-slate-800/20 transition-all duration-150"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#334155]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-slate-200">{client.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-400">{client.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${getTierColor(client.tier)}`}>
                        {client.tier}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{client.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{client.points.toLocaleString()} pts</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase inline-flex items-center gap-1 ${
                        client.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${client.status === 'Activo' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-3">
                      <button
                        onClick={() => onUpdateClientStatus(client.id, client.status === 'Activo' ? 'Suspendido' : 'Activo')}
                        className={`text-[10px] font-semibold ${client.status === 'Activo' ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                      >
                        {client.status === 'Activo' ? 'Suspender' : 'Activar'}
                      </button>
                      <button
                        onClick={() => onSelectClient(client)}
                        className="text-amber-500 hover:text-amber-400 font-bold inline-flex items-center gap-0.5 text-[10px]"
                      >
                        <span>Ver Ficha</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
