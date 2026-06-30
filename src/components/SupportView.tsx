import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { 
  ShieldAlert, 
  Clock, 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  Play,
  ArrowRight,
  Sparkles,
  RefreshCcw,
  UserCheck2
} from 'lucide-react';
import { motion } from 'motion/react';

interface SupportViewProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'timeAgo'>) => void;
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  onUpdateTicketPriority: (ticketId: string, priority: TicketPriority) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  tickets,
  onAddTicket,
  onUpdateTicketStatus,
  onUpdateTicketPriority
}) => {
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketClientName, setTicketClientName] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('Media');
  const [ticketAssignedTo, setTicketAssignedTo] = useState('Elena Torres');

  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'todos' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'todos' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketClientName || !ticketSubject) return;

    onAddTicket({
      clientName: ticketClientName,
      subject: ticketSubject,
      status: 'Pendiente',
      priority: ticketPriority,
      assignedTo: ticketAssignedTo
    });

    setTicketClientName('');
    setTicketSubject('');
    setIsCreatingTicket(false);
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Media': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Baja': return 'bg-slate-500/10 text-slate-300 border border-slate-500/20';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Pendiente': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'En Proceso': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Recibido': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  // Agent Workloads
  const concierges = [
    { name: "Carlos Ruiz", role: "Soporte Senior", active: tickets.filter(t => t.assignedTo === "Carlos Ruiz" && t.status !== 'Recibido').length },
    { name: "Elena Torres", role: "Concierge VIP", active: tickets.filter(t => t.assignedTo === "Elena Torres" && t.status !== 'Recibido').length },
    { name: "Andres Luna", role: "Tech Specialist", active: tickets.filter(t => t.assignedTo === "Andres Luna" && t.status !== 'Recibido').length }
  ];

  return (
    <div id="support-view" className="space-y-8 animate-fade-in text-slate-200">
      {/* SLA summary row */}
      <div id="sla-summary-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Promedio de Respuesta</p>
            <h4 className="text-xl font-bold text-white font-mono mt-0.5">14.8 min</h4>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">Bajo el límite de SLA</span>
          </div>
        </div>

        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tickets No Resueltos</p>
            <h4 className="text-xl font-bold text-white font-mono mt-0.5">
              {tickets.filter(t => t.status !== 'Recibido').length} activos
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Resolución urgente de retiros</span>
          </div>
        </div>

        <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Agentes Disponibles</p>
            <h4 className="text-xl font-bold text-white font-mono mt-0.5">3 En Línea</h4>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">Monitoreo activo de quejas</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div id="support-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column - Tickets List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            
            {/* Filter Header and trigger button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-white">Tickets de Atención Concierge</h3>
                <p className="text-xs text-slate-400">Revisión y asignación de casos VIP</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  id="btn-toggle-create-ticket"
                  onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Nuevo Ticket
                </button>
              </div>
            </div>

            {/* Inline ticket creator form */}
            {isCreatingTicket && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                id="create-ticket-box"
                className="bg-[#131926] border border-amber-500/20 rounded-xl p-5 mb-6 text-xs space-y-4"
              >
                <h4 className="font-bold text-amber-400 uppercase tracking-wider">Emitir Ticket de Asistencia VIP</h4>
                <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Socio VIP / Cliente *</label>
                    <input 
                      type="text" 
                      required
                      value={ticketClientName}
                      onChange={(e) => setTicketClientName(e.target.value)}
                      placeholder="Ej. Juan Delgado o Alessandra Mancini" 
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Soporte Concierge Asignado</label>
                    <select
                      value={ticketAssignedTo}
                      onChange={(e) => setTicketAssignedTo(e.target.value)}
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
                    >
                      <option value="Carlos Ruiz">Carlos Ruiz (Soporte Senior)</option>
                      <option value="Elena Torres">Elena Torres (Concierge VIP)</option>
                      <option value="Andres Luna">Andres Luna (Tech Specialist)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Descripción del Error / Requerimiento *</label>
                    <input 
                      type="text" 
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Ej. Error en acreditación de premio o Disputa de Poker Table #4" 
                      className="w-full bg-[#0E1321] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Nivel de Prioridad</label>
                    <div className="flex gap-3">
                      {(['Alta', 'Media', 'Baja'] as TicketPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTicketPriority(p)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                            ticketPriority === p 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                              : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingTicket(false)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-slate-950 font-bold"
                    >
                      Abrir Ticket
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* List level filter bar */}
            <div className="flex flex-wrap gap-3 mb-5 p-3.5 bg-[#131926]/40 border border-[#1E293B] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Estado:</span>
                <select 
                  id="ticket-status-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0E1321] border border-[#1E293B] px-2.5 py-1 rounded-lg text-xs outline-none"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Recibido">Recibido (Resuelto)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Prioridad:</span>
                <select 
                  id="ticket-priority-filter-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-[#0E1321] border border-[#1E293B] px-2.5 py-1 rounded-lg text-xs outline-none"
                >
                  <option value="todos">Todas las Prioridades</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            {/* List of active tickets */}
            <div id="tickets-list-wrapper" className="space-y-4">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    id={`ticket-card-box-${ticket.id}`}
                    className="p-4 bg-[#131926] border border-[#1E293B] hover:border-slate-700 transition-all rounded-xl space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg text-[10px] font-mono font-bold text-amber-500 border border-slate-800">
                          {ticket.id}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{ticket.subject}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Socio VIP: <span className="text-slate-200 font-medium">{ticket.clientName}</span> • Asignado: <span className="text-slate-200 font-medium">{ticket.assignedTo}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold font-mono ${getPriorityBadge(ticket.priority)}`}>
                          P. {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold font-mono ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    {/* Interactive operations on tickets */}
                    <div className="pt-3 border-t border-[#1E293B]/60 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500 font-mono">
                      <span>Iniciado: {ticket.timeAgo}</span>
                      
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-400">Modificar Estado:</span>
                        <div className="flex gap-1.5">
                          {(['Pendiente', 'En Proceso', 'Recibido'] as TicketStatus[]).map((st) => (
                            <button
                              key={st}
                              id={`btn-ticket-${ticket.id}-set-${st}`}
                              onClick={() => onUpdateTicketStatus(ticket.id, st)}
                              disabled={ticket.status === st}
                              className={`px-2 py-1 rounded border text-[9px] font-bold transition-all ${
                                ticket.status === st 
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 cursor-default'
                                  : 'bg-transparent border-slate-800 hover:border-slate-700 text-slate-400'
                              }`}
                            >
                              {st === 'Recibido' ? 'Resuelto' : st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-[#131926]/40 border border-[#1E293B] rounded-xl">
                  <p className="text-xs text-slate-500 italic">No se encontraron tickets con los filtros seleccionados.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right column - Concierges workload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0E1321] border border-[#1E293B] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <UserCheck2 className="w-4 h-4 text-amber-500" /> Carga de Agentes Concierge
            </h3>

            <div id="concierge-workloads-list" className="space-y-4 text-xs">
              {concierges.map((agent, i) => (
                <div 
                  key={i} 
                  id={`agent-workload-box-${i}`}
                  className="p-3.5 bg-[#131926]/50 border border-[#1E293B] rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-200">{agent.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{agent.role}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 font-mono text-[10px] font-bold rounded-full ${
                      agent.active > 1 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {agent.active} casos activos
                    </span>
                  </div>

                  {/* Visual progress bar bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full ${agent.active > 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                      style={{ width: `${Math.min((agent.active / 3) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E293B] text-[10px] text-slate-500 font-mono leading-relaxed">
              * El sistema redistribuye casos de forma inteligente según carga de trabajo y prioridad.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
