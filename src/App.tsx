import { useState, useEffect } from 'react';
import { 
  Client, 
  Ticket, 
  Promo, 
  EventItem, 
  Activity, 
  ActiveTab, 
  User 
} from './types';
import { 
  DEFAULT_USER, 
  INITIAL_CLIENTS, 
  INITIAL_TICKETS, 
  INITIAL_PROMOS, 
  INITIAL_EVENTS, 
  INITIAL_ACTIVITIES, 
  loadData, 
  saveData 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { ClientProfileView } from './components/ClientProfileView';
import { PromotionsView } from './components/PromotionsView';
import { SupportView } from './components/SupportView';
import { AnalyticsView } from './components/AnalyticsView';
import { LoginView } from './components/LoginView';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return loadData<boolean>('is_auth', false);
  });
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return loadData<ActiveTab>('active_tab', 'dashboard');
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Storage states
  const [clients, setClients] = useState<Client[]>(() => loadData<Client[]>('clients', INITIAL_CLIENTS));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadData<Ticket[]>('tickets', INITIAL_TICKETS));
  const [promos, setPromos] = useState<Promo[]>(() => loadData<Promo[]>('promos', INITIAL_PROMOS));
  const [events, setEvents] = useState<EventItem[]>(() => loadData<EventItem[]>('events', INITIAL_EVENTS));
  const [activities, setActivities] = useState<Activity[]>(() => loadData<Activity[]>('activities', INITIAL_ACTIVITIES));
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(() => {
    const cachedId = loadData<string | null>('selected_client_id', null);
    if (cachedId) {
      const found = loadData<Client[]>('clients', INITIAL_CLIENTS).find(c => c.id === cachedId);
      return found || null;
    }
    return null;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to storage on modification
  useEffect(() => {
    saveData('clients', clients);
  }, [clients]);

  useEffect(() => {
    saveData('tickets', tickets);
  }, [tickets]);

  useEffect(() => {
    saveData('promos', promos);
  }, [promos]);

  useEffect(() => {
    saveData('activities', activities);
  }, [activities]);

  useEffect(() => {
    saveData('is_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    saveData('active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedClient) {
      saveData('selected_client_id', selectedClient.id);
    } else {
      localStorage.removeItem('atlantic_crm_selected_client_id');
    }
  }, [selectedClient]);

  // Toast auto dismisser
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // HANDLERS
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedClient(null);
    showToast("Sesión cerrada correctamente", "info");
  };

  const handleUpdateClientStatus = (clientId: string, status: 'Activo' | 'Suspendido') => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updated = { ...c, status };
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updated);
        }
        return updated;
      }
      return c;
    }));

    // Log Activity entry
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        clientName: client.name,
        clientInitials: client.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        clientColor: status === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400',
        action: status === 'Activo' ? 'Habilitación de Acceso' : 'Suspensión de Cuenta VIP',
        status: status === 'Activo' ? 'COMPLETADO' : 'PENDIENTE',
        date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: status === 'Activo' ? 'Habilitado' : 'Suspendido'
      };
      setActivities(prev => [newAct, ...prev]);
    }

    showToast(`Estado de cliente actualizado a ${status}`, 'success');
  };

  const handleAdjustPoints = (clientId: string, amount: number) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updatedPoints = Math.max(0, c.points + amount);
        const updated = { ...c, points: updatedPoints };
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updated);
        }
        return updated;
      }
      return c;
    }));

    const client = clients.find(c => c.id === clientId);
    if (client) {
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        clientName: client.name,
        clientInitials: client.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        clientColor: amount >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400',
        action: amount >= 0 ? 'Acreditación de Puntos' : 'Canje / Débito de Puntos',
        status: 'COMPLETADO',
        date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: `${amount >= 0 ? '+' : ''}${amount.toLocaleString()} pts`
      };
      setActivities(prev => [newAct, ...prev]);
    }

    showToast(`Puntos del cliente modificados: ${amount >= 0 ? '+' : ''}${amount}`, 'success');
  };

  const handleRegisterClient = (newClientData: Omit<Client, 'id' | 'joinDate' | 'assignedPromos' | 'visitHistory'>) => {
    const newId = `#AC-${Math.floor(Math.random() * 90000) + 10000}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    const completeClient: Client = {
      ...newClientData,
      id: newId,
      joinDate: formattedDate,
      assignedPromos: [],
      visitHistory: [
        { date: 'Hoy', action: 'Registro Inicial en Portal', duration: '0h 05m', points: newClientData.points, status: 'Completado' }
      ]
    };

    setClients(prev => [completeClient, ...prev]);

    // Log Activity
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      clientName: completeClient.name,
      clientInitials: completeClient.name.split(' ').map(n => n[0]).join('').slice(0, 2),
      clientColor: 'bg-indigo-500/20 text-indigo-400',
      action: 'Registro de Socio VIP',
      status: 'COMPLETADO',
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: completeClient.tier.split(' ')[0]
    };
    setActivities(prev => [newAct, ...prev]);

    showToast(`Cliente ${completeClient.name} registrado con ID ${newId}`, 'success');
  };

  const handleAssignPromo = (clientId: string, promoId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updated = { ...c, assignedPromos: [...c.assignedPromos, promoId] };
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updated);
        }
        return updated;
      }
      return c;
    }));

    setPromos(prev => prev.map(p => {
      if (p.id === promoId) {
        return { ...p, participants: p.participants + 1 };
      }
      return p;
    }));

    const client = clients.find(c => c.id === clientId);
    const promo = promos.find(p => p.id === promoId);
    if (client && promo) {
      showToast(`Promoción "${promo.name}" asignada a ${client.name}`, 'success');
    }
  };

  const handleRemovePromo = (clientId: string, promoId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updated = { ...c, assignedPromos: c.assignedPromos.filter(id => id !== promoId) };
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updated);
        }
        return updated;
      }
      return c;
    }));

    setPromos(prev => prev.map(p => {
      if (p.id === promoId) {
        return { ...p, participants: Math.max(0, p.participants - 1) };
      }
      return p;
    }));

    showToast(`Promoción retirada exitosamente`, 'info');
  };

  const handleAddPromo = (newPromoData: Omit<Promo, 'id' | 'participants'>) => {
    const newPromo: Promo = {
      ...newPromoData,
      id: `promo-${Date.now()}`,
      participants: 0
    };
    setPromos(prev => [newPromo, ...prev]);
    showToast(`Campaña "${newPromo.name}" creada`, 'success');
  };

  const handleRewardClient = (clientId: string, points: number) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updated = { ...c, points: c.points + points };
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(updated);
        }
        return updated;
      }
      return c;
    }));

    const client = clients.find(c => c.id === clientId);
    if (client) {
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        clientName: client.name,
        clientInitials: client.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        clientColor: 'bg-amber-500/20 text-amber-400',
        action: 'Sorteo VIP Ganador',
        status: 'COMPLETADO',
        date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: `+${points.toLocaleString()} pts`
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  const handleAddTicket = (newTicketData: Omit<Ticket, 'id' | 'timeAgo'>) => {
    const newId = `#TK-${Math.floor(Math.random() * 9000) + 1000}`;
    const newTicket: Ticket = {
      ...newTicketData,
      id: newId,
      timeAgo: 'Hace unos segundos'
    };

    setTickets(prev => [newTicket, ...prev]);

    // Log Activity
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      clientName: newTicket.clientName,
      clientInitials: newTicket.clientName.split(' ').map(n => n[0]).join('').slice(0, 2),
      clientColor: 'bg-red-500/20 text-red-400',
      action: 'Apertura de Ticket Soporte',
      status: 'PENDIENTE',
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: newId
    };
    setActivities(prev => [newAct, ...prev]);

    showToast(`Ticket ${newId} creado correctamente`, 'success');
  };

  const handleUpdateTicketStatus = (ticketId: string, status: 'Pendiente' | 'En Proceso' | 'Recibido') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status };
      }
      return t;
    }));
    showToast(`Estado del ticket ${ticketId} actualizado a ${status}`, 'success');
  };

  const handleUpdateTicketPriority = (ticketId: string, priority: 'Alta' | 'Media' | 'Baja') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, priority };
      }
      return t;
    }));
    showToast(`Prioridad del ticket ${ticketId} establecida en ${priority}`, 'success');
  };

  // If not authenticated, show premium login view
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => { setIsAuthenticated(true); showToast("Acceso concedido al Portal VIP", "success"); }} />;
  }

  return (
    <div id="app-viewport-wrapper" className="min-h-screen bg-[#070A12] flex overflow-hidden font-sans antialiased text-slate-100">
      
      {/* Toast Overlay Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            id="toast-notification-banner"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border bg-slate-900 shadow-2xl min-w-80 max-w-sm"
            style={{
              borderColor: toast.type === 'success' ? 'rgba(16,185,129,0.3)' : toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)',
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <p className="text-xs text-slate-200 font-medium flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedClient(null); // Reset detail view when tab shifts
        }} 
        onLogout={handleLogout} 
      />

      {/* Primary Work Area Panel */}
      <div id="main-content-area" className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Page Top Header */}
        <Header 
          activeTab={activeTab} 
          user={DEFAULT_USER} 
          searchQuery={searchQuery}
          onSearch={(query) => {
            setSearchQuery(query);
            if (query && activeTab !== 'clients') {
              setActiveTab('clients'); // Auto switch to client directory if user starts searching
            }
          }}
        />

        {/* Dynamic View Panel render */}
        <main id="app-view-viewport" className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedClient ? `-${selectedClient.id}` : '')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  clients={clients} 
                  tickets={tickets} 
                  activities={activities} 
                  setActiveTab={setActiveTab}
                  onQuickRegisterClient={() => { setActiveTab('clients'); }}
                  onQuickCreateTicket={() => { setActiveTab('support'); }}
                />
              )}

              {activeTab === 'clients' && (
                selectedClient ? (
                  <ClientProfileView 
                    client={selectedClient}
                    allPromos={promos}
                    onBack={() => setSelectedClient(null)}
                    onUpdateStatus={handleUpdateClientStatus}
                    onAdjustPoints={handleAdjustPoints}
                    onAssignPromo={handleAssignPromo}
                    onRemovePromo={handleRemovePromo}
                  />
                ) : (
                  <ClientsView 
                    clients={clients} 
                    onSelectClient={setSelectedClient} 
                    onUpdateClientStatus={handleUpdateClientStatus}
                    onAdjustPoints={handleAdjustPoints}
                    onRegisterClient={handleRegisterClient}
                    searchQuery={searchQuery}
                  />
                )
              )}

              {activeTab === 'promotions' && (
                <PromotionsView 
                  promos={promos} 
                  events={events}
                  clients={clients}
                  onAddPromo={handleAddPromo}
                  onRewardClient={handleRewardClient}
                />
              )}

              {activeTab === 'support' && (
                <SupportView 
                  tickets={tickets} 
                  onAddTicket={handleAddTicket}
                  onUpdateTicketStatus={handleUpdateTicketStatus}
                  onUpdateTicketPriority={handleUpdateTicketPriority}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView 
                  clients={clients} 
                  promos={promos} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
