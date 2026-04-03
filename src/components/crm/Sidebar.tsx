import Icon from '@/components/ui/icon';

export type Section =
  | 'dashboard'
  | 'funnel'
  | 'clients'
  | 'deals'
  | 'documents'
  | 'analytics'
  | 'integrations'
  | 'communication'
  | 'settings';

interface NavItem {
  id: Section;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
  { id: 'funnel', label: 'Воронка продаж', icon: 'TrendingUp' },
  { id: 'clients', label: 'Клиенты', icon: 'Users' },
  { id: 'deals', label: 'Сделки', icon: 'Handshake' },
  { id: 'documents', label: 'Документы', icon: 'FileText' },
  { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
  { id: 'integrations', label: 'Интеграции', icon: 'Plug' },
  { id: 'communication', label: 'Коммуникации', icon: 'MessageSquare' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="crm-sidebar w-60 min-h-screen flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">SalesCRM</p>
            <p className="text-white/40 text-xs">Управление продажами</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              active === item.id ? 'nav-item-active' : 'nav-item-inactive'
            }`}
          >
            <Icon name={item.icon} size={17} fallback="Circle" />
            <span>{item.label}</span>
            {active === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">АИ</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Алексей Иванов</p>
            <p className="text-white/40 text-xs">Менеджер</p>
          </div>
          <button className="ml-auto text-white/40 hover:text-white/70 transition-colors">
            <Icon name="LogOut" size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}