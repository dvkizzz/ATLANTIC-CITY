export type ClientTier = 'Platinum Elite' | 'Gold Member' | 'Silver Plus';
export type ClientStatus = 'Activo' | 'Suspendido';
export type TicketStatus = 'Pendiente' | 'En Proceso' | 'Recibido';
export type TicketPriority = 'Alta' | 'Media' | 'Baja';
export type PromoStatus = 'Activa' | 'Programada' | 'Finalizada';
export type ActivityStatus = 'COMPLETADO' | 'PROCESANDO' | 'PENDIENTE';

export interface Client {
  id: string; // e.g. #AC-88219
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  joinDate: string;
  status: ClientStatus;
  tier: ClientTier;
  points: number;
  visitsPerMonth: number;
  avatar: string;
  location: string;
  languages: string[];
  preferences: string[];
  assignedPromos: string[]; // references Promo.id
  visitHistory: {
    date: string;
    action: string;
    duration: string;
    points: number;
    status: 'Completado' | 'En Proceso';
  }[];
}

export interface Ticket {
  id: string; // e.g. #TK-8821
  clientName: string;
  clientAvatar?: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  timeAgo: string;
  assignedTo: string;
}

export interface Promo {
  id: string;
  name: string;
  status: PromoStatus;
  startDate: string;
  endDate: string;
  type: 'poker' | 'celebration' | 'liquor' | 'raffle' | 'parking';
  participants: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  day: number;
  month: string;
}

export interface Activity {
  id: string;
  clientName: string;
  clientInitials: string;
  clientColor: string;
  action: string;
  status: ActivityStatus;
  date: string;
  amount: string;
}

export type ActiveTab = 'dashboard' | 'clients' | 'promotions' | 'support' | 'analytics';

export interface User {
  name: string;
  role: string;
  avatar: string;
}
