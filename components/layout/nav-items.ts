import {
  Compass,
  Sparkles,
  KanbanSquare,
  Award,
  BarChart3,
  ShieldCheck,
  Home,
  Globe2,
  CalendarDays,
  Orbit,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export const STUDENT_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "world-pulse", label: "World Pulse", href: "/world-pulse", icon: Globe2 },
  { id: "world-graph", label: "World Graph", href: "/world-graph", icon: Orbit },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: CalendarDays },
  { id: "radar", label: "Radar", href: "/radar", icon: Compass },
  { id: "pulse", label: "PULSE", href: "/pulse", icon: Sparkles },
  { id: "tracker", label: "Tracker", href: "/tracker", icon: KanbanSquare },
  { id: "passport", label: "Passport", href: "/passport", icon: Award },
];

export const INSTITUTION_NAV: NavItem[] = [
  { id: "analytics", label: "Analytics", href: "/institution", icon: BarChart3 },
  { id: "student-view", label: "Student View", href: "/", icon: Home },
];

export const ADMIN_NAV: NavItem[] = [
  { id: "catalogue", label: "Catalogue & Queue", href: "/admin", icon: ShieldCheck },
  { id: "analytics", label: "Institution View", href: "/institution", icon: BarChart3 },
  { id: "student-view", label: "Student View", href: "/", icon: Home },
];
