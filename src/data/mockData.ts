import { Client, Ticket, Promo, EventItem, Activity, User } from '../types';

export const DEFAULT_USER: User = {
  name: "Alex River",
  role: "Admin Manager",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCws4SEl0OoPru6qFQmkXVxKBL4TasWWtmiNpov3cfuTMrbWKBUlk5ENqCrTdjI0p-XvOWL9oKaEbiE-3TwTgi5HwGtj7b2V1rTUH9B2EpcYoaREjttVgzY-Sdz4uaHREI5YxvXAMJbV8NIl8eug9OII68XnOff5oQOz12NTT-myJDQFZT6krMNiC3LKO1gCW8uQsvGpuBPvEx1_JEaNx1vee5ZLNzPKvyRRmFMwXb4Fgsek7PABOPoR_AjP8A4VxAeTEfwuHFpaK3I"
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "#AC-88219",
    name: "Alessandra Mancini",
    email: "a.mancini@corporate.com",
    phone: "+51 984 321 098",
    birthDate: "12 de Agosto, 1990",
    joinDate: "05 de Enero, 2021",
    status: "Activo",
    tier: "Platinum Elite",
    points: 42500,
    visitsPerMonth: 11,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuALPXWQ6l64IuEAkn9KVKm1FAIUUfHrAijEkV6H-YHM7p8nBc45_h8a-b30qqCNXbxHy4YVPCwpy8KEprx2f8jmwwrtP1oog95mP4_9ut9fPRXjYZNOVve_BOwktV8f3IYr4kjGq9JSvCR0b_x2Vcor1LH6rAE0OLJwownrmC0PwzPLZeSAhtyb-t5BEWW2Uso8g4us1nsClDmbJMy2h_Temi3cQIJc_zNiIohYxZq91yzfmdOttFtNJ_0fdPajnvRozZlLUUKko4HC",
    location: "Milán, Italia",
    languages: ["Italiano", "Inglés"],
    preferences: ["Mesas VIP", "Blackjack B12", "Single Malt Scotch"],
    assignedPromos: ["promo-1", "promo-4"],
    visitHistory: [
      { date: "30 Jun, 2026", action: "Blackjack Table B12", duration: "2h 15m", points: 800, status: "Completado" },
      { date: "28 Jun, 2026", action: "Roulette VIP Lounge", duration: "1h 45m", points: 450, status: "Completado" }
    ]
  },
  {
    id: "#AC-77102",
    name: "Ricardo Montenegro",
    email: "r.montenegro@premium.pe",
    phone: "+51 987 654 321",
    birthDate: "15 de Mayo, 1982",
    joinDate: "12 de Octubre, 2019",
    status: "Activo",
    tier: "Gold Member",
    points: 428500,
    visitsPerMonth: 14,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAL6aQfRQooynwTLcnKEkkpM4SSzsOZOt0WwZjEy-Oe1XGE5DY3eOgEYReaoiGcALFy14XhaSzc0P_nrvHfvOksZtRtcgTBNWda8aUwzhUynKX83SGZnNfi6_D0y3XnUIiQD75u9Skfu-CEUIaq16tMRoA6xc1CdlcJ8oukco4LBA679088C1Qt37WL2lS9JGu_3QW0ftn50b9J86GsP4cdXtko3BwdeQFTq1coqn2iASi4l4zDl43dC5dHL-WuGLPCU8yF90G3ryq",
    location: "Lima, Perú",
    languages: ["Español", "Inglés"],
    preferences: ["Poker Texas Hold'em", "Tragamonedas VIP", "Single Malt Scotch", "Noches de Fin de Semana"],
    assignedPromos: ["promo-2", "promo-5"],
    visitHistory: [
      { date: "12 Oct, 2023", action: "Poker Table #04", duration: "4h 20m", points: 2400, status: "Completado" },
      { date: "08 Oct, 2023", action: "Slots VIP Area", duration: "1h 15m", points: 850, status: "Completado" },
      { date: "05 Oct, 2023", action: "Atlantic Lounge Bar", duration: "2h 45m", points: 120, status: "Completado" },
      { date: "01 Oct, 2023", action: "Poker Table #02", duration: "6h 10m", points: 3100, status: "Completado" }
    ]
  },
  {
    id: "#AC-92011",
    name: "Sebastián Thorne",
    email: "thorne_vip@icloud.com",
    phone: "+1 (555) 304-2019",
    birthDate: "30 de Abril, 1988",
    joinDate: "15 de Noviembre, 2022",
    status: "Suspendido",
    tier: "Silver Plus",
    points: 0,
    visitsPerMonth: 2,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXWymMNeLVSCslMuod-8_50bj59Ipw7I3QVMzeneIxageUdOs5jqUQjGh8Hm5eXzcjUCQ8XH33GcOB9_CGpxL1sc9_w6xG7vN_os1b5NJGH8pj6DCXlFydKfY9g86xd05zUjZJQSa34dphGa8AJ7IsBICLpasYeHy-n8Jz0AWcjsk5-XRUd_LJE_39Hc8pEbgQytIaj3dxjrwB9afGkNUiMXqL5WrIjyt2O9d0cz9gv_Q6pbNIlmjawmiSurhTMcJge18Qi0dTNhDB",
    location: "Miami, USA",
    languages: ["Inglés", "Español"],
    preferences: ["Control de Acceso B", "Apuestas Deportivas"],
    assignedPromos: [],
    visitHistory: [
      { date: "30 Abr, 2024", action: "Sports Bar Bets", duration: "0h 45m", points: 0, status: "Completado" }
    ]
  },
  {
    id: "#AC-88123",
    name: "Carmen Rosa Vargas",
    email: "carmen.vargas@outlook.com",
    phone: "+51 912 345 678",
    birthDate: "18 de Diciembre, 1975",
    joinDate: "14 de Febrero, 2018",
    status: "Activo",
    tier: "Platinum Elite",
    points: 124820,
    visitsPerMonth: 18,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9SSmPYBqaal_mDra5_g24KAfiQU79SZvnssaMPEzGZaHeOSZwUp7FrlsTrjho5k1qph5scVspNBhbEs38vx3tF-l1aVnaCJelH-5zFvNn6lLXsYYpNyzRlOWF_mdOt_JQarbwxQuKgLwK_JQVeqRUmQHxf8PyuVE-9Dg3UzbSLruq1guafWlA-o4uFgNZzyzxERvNtp0GfrMX4MlkjgiwBGTgK_ER6gx_jcebD2nb3gd2Fd7SB-QZ7MO9e2ENsm8uQOYSjOfMmNpK",
    location: "Arequipa, Perú",
    languages: ["Español"],
    preferences: ["Roulette VIP", "Baccarat Table C4", "Luxury Dining"],
    assignedPromos: ["promo-1", "promo-3"],
    visitHistory: [
      { date: "29 Jun, 2026", action: "Baccarat Table C4", duration: "3h 10m", points: 1500, status: "Completado" },
      { date: "27 Jun, 2026", action: "Luxury Restaurant Gold", duration: "1h 30m", points: 200, status: "Completado" }
    ]
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "#TK-8821",
    clientName: "Juan Delgado",
    clientAvatar: undefined,
    subject: "Error en retiro de premios VIP",
    status: "Pendiente",
    priority: "Alta",
    timeAgo: "Hace 15 min",
    assignedTo: "Carlos Ruiz"
  },
  {
    id: "#TK-8819",
    clientName: "Maria Soares",
    clientAvatar: undefined,
    subject: "Duda sobre vigencia de cupones",
    status: "En Proceso",
    priority: "Media",
    timeAgo: "Hace 2 horas",
    assignedTo: "Elena Torres"
  },
  {
    id: "#TK-8815",
    clientName: "Ricardo Alva",
    clientAvatar: undefined,
    subject: "Sugerencia para área de Poker",
    status: "Recibido",
    priority: "Baja",
    timeAgo: "Ayer",
    assignedTo: "Andres Luna"
  }
];

export const INITIAL_PROMOS: Promo[] = [
  {
    id: "promo-1",
    name: "Torneo de Poker Black Edition",
    status: "Activa",
    startDate: "01 Oct 2023",
    endDate: "31 Oct 2023",
    type: "poker",
    participants: 840
  },
  {
    id: "promo-2",
    name: "Bono Bienvenida Elite Lounge",
    status: "Activa",
    startDate: "15 Sep 2023",
    endDate: "15 Nov 2023",
    type: "celebration",
    participants: 1250
  },
  {
    id: "promo-3",
    name: "Sorteo Especial Aniversario",
    status: "Programada",
    startDate: "01 Nov 2023",
    endDate: "05 Nov 2023",
    type: "raffle",
    participants: 0
  },
  {
    id: "promo-4",
    name: "After Office Cocktails 2x1",
    status: "Activa",
    startDate: "01 Oct 2023",
    endDate: "31 Oct 2023",
    type: "liquor",
    participants: 410
  },
  {
    id: "promo-5",
    name: "Valet Parking Gratuito",
    status: "Activa",
    startDate: "Sinn Límite",
    endDate: "Permanente",
    type: "parking",
    participants: 340
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Gala de Beneficencia",
    date: "12 Oct 2023",
    time: "20:30",
    location: "Salon Real",
    day: 12,
    month: "OCT"
  },
  {
    id: "event-2",
    title: "Slots Challenge 50k",
    date: "15 Oct 2023",
    time: "18:00",
    location: "Zona VIP A",
    day: 15,
    month: "OCT"
  },
  {
    id: "event-3",
    title: "Noche de Jazz & Poker",
    date: "22 Oct 2023",
    time: "21:00",
    location: "Bar 21",
    day: 22,
    month: "OCT"
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    clientName: "Ricardo Alva",
    clientInitials: "RA",
    clientColor: "bg-amber-500/20 text-amber-400",
    action: "Canje de Puntos",
    status: "COMPLETADO",
    date: "Hoy, 14:20",
    amount: "2,400 pts"
  },
  {
    id: "act-2",
    clientName: "Maria Castro",
    clientInitials: "MC",
    clientColor: "bg-purple-500/20 text-purple-400",
    action: "Actualización VIP",
    status: "PROCESANDO",
    date: "Hoy, 13:45",
    amount: "Gold Tier"
  },
  {
    id: "act-3",
    clientName: "Juan Lopez",
    clientInitials: "JL",
    clientColor: "bg-red-500/20 text-red-400",
    action: "Reclamo Soporte",
    status: "PENDIENTE",
    date: "Ayer, 18:10",
    amount: "#REC-492"
  },
  {
    id: "act-4",
    clientName: "Diana Velez",
    clientInitials: "DV",
    clientColor: "bg-green-500/20 text-green-400",
    action: "Depósito Cash",
    status: "COMPLETADO",
    date: "Ayer, 16:30",
    amount: "S/ 500.00"
  }
];

// Helper to interact with Local Storage
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`atlantic_crm_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage`, error);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(`atlantic_crm_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};
