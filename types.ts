
export enum AppView {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  avatar: string;
  lastLogin: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
}
