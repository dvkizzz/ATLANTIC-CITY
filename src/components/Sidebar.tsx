import React from 'react';
import { ActiveTab } from '../types';
import { 
  Diamond, 
  LayoutDashboard, 
  Users, 
  Award, 
  ShieldAlert, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients' as ActiveTab, label: 'Clientes VIP', icon: Users },
    { id: 'promotions' as ActiveTab, label: 'Promociones', icon: Award },
    { id: 'support' as ActiveTab, label: 'Centro Ayuda', icon: ShieldAlert },
    { id: 'analytics' as ActiveTab, label: 'Operaciones', icon: BarChart3 },
  ];

  return (
    <aside id="sidebar-container" className="w-68 bg-[#0B0F19] border-r border-[#1E293B] flex flex-col h-full text-slate-200">
      {/* Brand Header */}
      <div id="sidebar-header" className="p-6 border-b border-[#1E293B] flex items-center gap-3">
        <div id="brand-logo-wrapper" className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
          <Diamond className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 id="brand-title" className="font-semibold text-lg tracking-wider text-amber-400">ATLANTIC CITY</h1>
          <p id="brand-subtitle" className="text-[10px] text-slate-400 tracking-widest uppercase">Elite CRM Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav" className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div id="nav-section-label" className="px-3 mb-3 text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
          Menú de Gestión
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group text-left ${
                isActive 
                  ? 'text-amber-400 bg-amber-500/5 border border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.08)]' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  id="nav-active-bar"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom User Controls */}
      <div id="sidebar-footer" className="p-4 border-t border-[#1E293B] bg-[#070B13]">
        <button
          id="btn-sidebar-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/10"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
