import React, { useState } from 'react';
import { ActiveTab, User } from '../types';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Check, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: ActiveTab;
  user: User;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, user, onSearch, searchQuery }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Juan Delgado abrió ticket #TK-8821 (Retiro VIP)", time: "Hace 15m", read: false },
    { id: 2, text: "Ricardo Montenegro ingresó a Sala de Poker Texas", time: "Hace 45m", read: false },
    { id: 3, text: "Diana Velez acreditó S/ 500.00 en caja", time: "Hace 2h", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getTabTitle = (tab: ActiveTab) => {
    switch(tab) {
      case 'dashboard': return 'Resumen Operativo';
      case 'clients': return 'Directorio de Clientes VIP';
      case 'promotions': return 'Campaña y Sorteos Premium';
      case 'support': return 'Centro de Ayuda Concierge';
      case 'analytics': return 'Métricas y Rendimiento';
      default: return 'Atlantic City CRM';
    }
  };

  return (
    <header id="app-header" className="h-20 bg-[#0B0F19] border-b border-[#1E293B] px-8 flex items-center justify-between sticky top-0 z-40 text-slate-100">
      {/* Title & Badge */}
      <div id="header-title-section" className="flex items-center gap-3">
        <h2 id="header-tab-title" className="text-xl font-semibold tracking-tight text-white">{getTabTitle(activeTab)}</h2>
        <div id="header-live-badge" className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sincronizado
        </div>
      </div>

      {/* Center Search Bar */}
      <div id="header-search-section" className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar clientes por nombre, ID o email..."
            className="w-full bg-[#131926] border border-[#1E293B] hover:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 transition-all duration-300 outline-none"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div id="header-controls" className="flex items-center gap-4">
        {/* Help Note */}
        <div id="header-tech-badge" className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 border border-amber-500/10 rounded-lg text-amber-500 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Vite + React 19 Active</span>
        </div>

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-[#131926] border border-[#1E293B] hover:border-slate-700 text-slate-300 hover:text-white transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span id="unread-notification-dot" className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                id="notifications-dropdown"
                className="absolute right-0 mt-3 w-80 bg-[#0E1321] border border-[#1E293B] rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#131926]">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Alertas del Casino</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-all"
                    >
                      <Check className="w-3 h-3" /> Marcar Todo
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#1E293B]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 text-xs transition-colors hover:bg-slate-800/40 ${
                        notif.read ? 'text-slate-400' : 'text-slate-200 bg-amber-500/[0.02]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="leading-relaxed">{notif.text}</p>
                        {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">{notif.time}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[#1E293B] bg-[#0A0E1A] text-center">
                  <p className="text-[10px] text-slate-500">Monitoreo de transacciones VIP en tiempo real</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Administrator Profile Card */}
        <div id="user-profile-badge" className="flex items-center gap-3 pl-3 border-l border-[#1E293B]">
          <img
            id="header-user-avatar"
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
            referrerPolicy="no-referrer"
          />
          <div id="user-info-text" className="hidden lg:block text-left">
            <p id="user-info-name" className="text-xs font-medium text-slate-100">{user.name}</p>
            <p id="user-info-role" className="text-[10px] text-amber-500 font-mono tracking-wider uppercase">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
