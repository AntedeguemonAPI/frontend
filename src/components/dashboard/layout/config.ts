import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Visão geral', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Gerenciar usuários', href: paths.dashboard.customers, icon: 'users' },
  /* { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' }, */
  /* { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' }, */
  { key: 'account', title: 'Minha conta', href: paths.dashboard.account, icon: 'user' },
  /* { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' }, */
] satisfies NavItemConfig[];
