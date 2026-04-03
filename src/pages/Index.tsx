import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYandexAuth } from '@/components/extensions/yandex-auth/useYandexAuth';
import Sidebar, { type Section } from '@/components/crm/Sidebar';
import Dashboard from '@/components/crm/Dashboard';
import Funnel from '@/components/crm/Funnel';
import Clients from '@/components/crm/Clients';
import Deals from '@/components/crm/Deals';
import Documents from '@/components/crm/Documents';
import Analytics from '@/components/crm/Analytics';
import Integrations from '@/components/crm/Integrations';
import Communication from '@/components/crm/Communication';
import Settings from '@/components/crm/Settings';
import Icon from '@/components/ui/icon';

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  dashboard: { title: 'Дашборд', subtitle: 'Общая картина бизнеса' },
  funnel: { title: 'Воронка продаж', subtitle: 'Этапы и прогнозирование' },
  clients: { title: 'Клиенты', subtitle: 'Управление контактами и сегментация' },
  deals: { title: 'Сделки', subtitle: 'Создание, отслеживание и закрытие' },
  documents: { title: 'Документы', subtitle: 'Счета, договоры и предложения' },
  analytics: { title: 'Аналитика', subtitle: 'Отчёты, метрики и KPI' },
  integrations: { title: 'Интеграции', subtitle: 'Внешние сервисы и API' },
  communication: { title: 'Коммуникации', subtitle: 'Письма, звонки, встречи и заметки' },
  settings: { title: 'Настройки', subtitle: 'Пользователи, роли и параметры системы' },
};

function renderSection(section: Section) {
  switch (section) {
    case 'dashboard': return <Dashboard />;
    case 'funnel': return <Funnel />;
    case 'clients': return <Clients />;
    case 'deals': return <Deals />;
    case 'documents': return <Documents />;
    case 'analytics': return <Analytics />;
    case 'integrations': return <Integrations />;
    case 'communication': return <Communication />;
    case 'settings': return <Settings />;
    default: return <Dashboard />;
  }
}

const AUTH_URL = 'https://functions.poehali.dev/752120dd-cc58-4568-bef7-e1c3e9d5cff7';
const apiUrls = {
  authUrl: `${AUTH_URL}?action=auth-url`,
  callback: `${AUTH_URL}?action=callback`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
};

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const navigate = useNavigate();
  const auth = useYandexAuth({ apiUrls });

  if (!auth.isLoading && !auth.isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!auth.isLoading && auth.isAuthenticated && auth.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Доступ ограничен</h2>
          <p className="text-white/50 text-sm mb-6">Ваш аккаунт <span className="text-white/80">{auth.user?.email}</span> зарегистрирован, но не имеет прав для входа в систему. Обратитесь к администратору.</p>
          <button onClick={() => auth.logout()} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">
            Выйти
          </button>
        </div>
      </div>
    );
  }

  const displayName = auth.user?.name || 'Пользователь';
  const initials = displayName.trim().split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  const { title, subtitle } = sectionTitles[activeSection];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar active={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-border/60 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Icon name="Bell" size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Icon name="Search" size={18} />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Icon name="HelpCircle" size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <div className="flex items-center gap-2.5 cursor-pointer hover:bg-muted rounded-xl px-2 py-1.5 transition-colors">
              {auth.user?.avatar_url ? (
                <img src={auth.user.avatar_url} className="w-7 h-7 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-medium text-foreground leading-tight">{displayName}</p>
                <p className="text-xs text-muted-foreground">{auth.user?.email || 'Менеджер'}</p>
              </div>
              <button
                onClick={() => auth.logout()}
                title="Выйти"
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="LogOut" size={14} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto animate-fade-in" key={activeSection}>
          {renderSection(activeSection)}
        </div>
      </main>
    </div>
  );
}