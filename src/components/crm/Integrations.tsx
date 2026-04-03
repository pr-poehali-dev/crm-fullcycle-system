import { useState } from "react";
import Icon from "@/components/ui/icon";

type IntegrationStatus = "Подключено" | "Доступно" | "Скоро";

interface Integration {
  id: number;
  emoji: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  category: string;
  lastSync?: string;
}

interface Webhook {
  id: number;
  name: string;
  url: string;
  event: string;
  active: boolean;
  lastTriggered: string;
}

const integrations: Integration[] = [
  {
    id: 1,
    emoji: "✈️",
    name: "Telegram",
    description: "Уведомления и боты для команды продаж",
    status: "Подключено",
    category: "Мессенджеры",
    lastSync: "2 мин назад",
  },
  {
    id: 2,
    emoji: "💬",
    name: "WhatsApp",
    description: "Общение с клиентами через WhatsApp Business",
    status: "Подключено",
    category: "Мессенджеры",
    lastSync: "15 мин назад",
  },
  {
    id: 3,
    emoji: "📧",
    name: "Gmail",
    description: "Синхронизация входящей и исходящей почты",
    status: "Подключено",
    category: "Email",
    lastSync: "5 мин назад",
  },
  {
    id: 4,
    emoji: "🏢",
    name: "1С:Предприятие",
    description: "Двусторонняя синхронизация счетов и клиентов",
    status: "Подключено",
    category: "Бухгалтерия",
    lastSync: "1 ч назад",
  },
  {
    id: 5,
    emoji: "🔗",
    name: "AmoCRM",
    description: "Импорт сделок и контактов из AmoCRM",
    status: "Доступно",
    category: "CRM",
  },
  {
    id: 6,
    emoji: "⚙️",
    name: "Bitrix24",
    description: "Перенос базы клиентов и истории сделок",
    status: "Доступно",
    category: "CRM",
  },
  {
    id: 7,
    emoji: "⚡",
    name: "Zapier",
    description: "Автоматизация рабочих процессов через 5000+ приложений",
    status: "Доступно",
    category: "Автоматизация",
  },
  {
    id: 8,
    emoji: "📊",
    name: "Google Sheets",
    description: "Экспорт отчётов и данных в таблицы Google",
    status: "Подключено",
    category: "Таблицы",
    lastSync: "30 мин назад",
  },
  {
    id: 9,
    emoji: "📈",
    name: "Яндекс.Метрика",
    description: "Отслеживание источников лидов и конверсий",
    status: "Доступно",
    category: "Аналитика",
  },
  {
    id: 10,
    emoji: "💼",
    name: "Slack",
    description: "Уведомления команды о новых сделках и задачах",
    status: "Скоро",
    category: "Мессенджеры",
  },
];

const webhooks: Webhook[] = [
  {
    id: 1,
    name: "Новая сделка",
    url: "https://hooks.example.com/deal-created",
    event: "deal.created",
    active: true,
    lastTriggered: "10 мин назад",
  },
  {
    id: 2,
    name: "Сделка выиграна",
    url: "https://hooks.example.com/deal-won",
    event: "deal.won",
    active: true,
    lastTriggered: "2 ч назад",
  },
  {
    id: 3,
    name: "Новый клиент",
    url: "https://hooks.example.com/client-created",
    event: "client.created",
    active: false,
    lastTriggered: "3 дня назад",
  },
];

const statusBadge: Record<IntegrationStatus, string> = {
  Подключено: "badge-green",
  Доступно: "badge-blue",
  Скоро: "badge-amber",
};

const statusIcon: Record<IntegrationStatus, string> = {
  Подключено: "CheckCircle2",
  Доступно: "PlusCircle",
  Скоро: "Clock",
};

const categories = ["Все", "Мессенджеры", "Email", "CRM", "Бухгалтерия", "Аналитика", "Автоматизация", "Таблицы"];

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [apiVisible, setApiVisible] = useState(false);
  const apiKey = "sk-crm-prod-a7f3d9e2b1c4f6a8d0e3b5c7f9a2d4e6";
  const maskedKey = apiKey.slice(0, 12) + "•".repeat(20) + apiKey.slice(-4);

  const filtered = integrations.filter(
    (i) => activeCategory === "Все" || i.category === activeCategory
  );

  const connectedCount = integrations.filter((i) => i.status === "Подключено").length;

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Интеграции</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {connectedCount} из {integrations.length} интеграций подключено
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "hsl(var(--crm-blue))" }}
        >
          <Icon name="Plus" size={15} />
          Добавить интеграцию
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Подключено", value: String(connectedCount), iconName: "Plug", iconBg: "bg-green-50", iconColor: "text-green-500" },
          { label: "Доступно", value: String(integrations.filter((i) => i.status === "Доступно").length), iconName: "PlusCircle", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
          { label: "Скоро", value: String(integrations.filter((i) => i.status === "Скоро").length), iconName: "Clock", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
              <Icon name={s.iconName} size={20} className={s.iconColor} />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground leading-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
              activeCategory === cat
                ? "text-white border-transparent shadow-sm"
                : "bg-white border-border/50 text-muted-foreground hover:bg-muted/40"
            }`}
            style={activeCategory === cat ? { background: "hsl(var(--crm-blue))" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((intg) => (
          <div
            key={intg.id}
            className={`bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-4 ${
              intg.status === "Подключено" ? "border-green-200/60" : "border-border/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center text-2xl shrink-0">
                  {intg.emoji}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{intg.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusBadge[intg.status]}`}>
                    {intg.status}
                  </span>
                </div>
              </div>
              <Icon name={statusIcon[intg.status]} size={16} className={
                intg.status === "Подключено" ? "text-green-500" :
                intg.status === "Доступно" ? "text-blue-400" : "text-amber-400"
              } />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{intg.description}</p>

            <div className="flex items-center justify-between mt-auto pt-1">
              {intg.lastSync ? (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Icon name="RefreshCw" size={10} />
                  {intg.lastSync}
                </span>
              ) : (
                <span />
              )}

              {intg.status === "Подключено" ? (
                <div className="flex items-center gap-1.5">
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-blue hover:opacity-80 transition-opacity">
                    <Icon name="Settings2" size={11} />
                    Настройки
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">
                    <Icon name="Unplug" size={11} />
                    Отключить
                  </button>
                </div>
              ) : intg.status === "Доступно" ? (
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-sm hover:shadow transition-all"
                  style={{ background: "hsl(var(--crm-blue))" }}
                >
                  <Icon name="Plug" size={11} />
                  Подключить
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium badge-amber cursor-not-allowed"
                >
                  <Icon name="Clock" size={11} />
                  Скоро
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API section */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <Icon name="KeyRound" size={15} className="text-violet-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">API & Вебхуки</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium badge-blue hover:opacity-80 transition-opacity">
            <Icon name="RefreshCw" size={12} />
            Сгенерировать новый
          </button>
        </div>

        {/* API Key */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/40">
          <Icon name="Key" size={15} className="text-muted-foreground shrink-0" />
          <code className="flex-1 text-xs font-mono text-foreground truncate">
            {apiVisible ? apiKey : maskedKey}
          </code>
          <button
            onClick={() => setApiVisible((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <Icon name={apiVisible ? "EyeOff" : "Eye"} size={15} />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <Icon name="Copy" size={15} />
          </button>
        </div>

        {/* Webhooks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Вебхуки</p>
            <button className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg badge-blue hover:opacity-80 transition-opacity">
              <Icon name="Plus" size={11} />
              Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 hover:bg-muted/20 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${wh.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{wh.name}</span>
                    <code className="text-[10px] badge-violet px-1.5 py-0.5 rounded font-mono">{wh.event}</code>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{wh.url}</p>
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0 text-right">
                  <div>Последний вызов</div>
                  <div className="font-medium text-foreground">{wh.lastTriggered}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-amber-50 hover:text-amber-500 transition-colors">
                    <Icon name="Pencil" size={13} />
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-colors">
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
