import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { commsApi } from "@/lib/api";

const commPalettes = [
  { bg: "from-blue-100 to-blue-200", text: "text-blue-700" },
  { bg: "from-violet-100 to-violet-200", text: "text-violet-700" },
  { bg: "from-green-100 to-green-200", text: "text-green-700" },
  { bg: "from-amber-100 to-amber-200", text: "text-amber-700" },
  { bg: "from-rose-100 to-rose-200", text: "text-rose-700" },
];

type CommType = "Письмо" | "Звонок" | "Встреча" | "Заметка";
type TabFilter = "Все" | "Письма" | "Звонки" | "Встречи" | "Заметки";
type CallResult = "Состоялся" | "Не дозвонился" | "Перезвонить";

interface Communication {
  id: number;
  type: CommType;
  datetime: string;
  datetimeRaw: string;
  client: string;
  manager: string;
  managerInitials: string;
  managerGrad: string;
  managerText: string;
  description: string;
  duration?: string;
  callResult?: CallResult;
  subject?: string;
  location?: string;
}

const tabToType: Partial<Record<TabFilter, CommType>> = {
  Письма: "Письмо",
  Звонки: "Звонок",
  Встречи: "Встреча",
  Заметки: "Заметка",
};

const typeIcon: Record<CommType, string> = {
  Письмо: "Mail",
  Звонок: "Phone",
  Встреча: "CalendarCheck",
  Заметка: "StickyNote",
};

const typeBg: Record<CommType, string> = {
  Письмо: "bg-violet-50",
  Звонок: "bg-green-50",
  Встреча: "bg-amber-50",
  Заметка: "bg-blue-50",
};

const typeIconColor: Record<CommType, string> = {
  Письмо: "text-violet-500",
  Звонок: "text-green-500",
  Встреча: "text-amber-500",
  Заметка: "text-blue-500",
};

const typeBadge: Record<CommType, string> = {
  Письмо: "badge-violet",
  Звонок: "badge-green",
  Встреча: "badge-amber",
  Заметка: "badge-blue",
};

const callResultBadge: Record<CallResult, string> = {
  Состоялся: "badge-green",
  "Не дозвонился": "badge-rose",
  Перезвонить: "badge-amber",
};

const allCommunications: Communication[] = [
  {
    id: 1,
    type: "Звонок",
    datetime: "03 апр 2026, 14:32",
    datetimeRaw: "2026-04-03T14:32",
    client: "АО «Прогресс Групп»",
    manager: "Дмитрий Лебедев",
    managerInitials: "ДЛ",
    managerGrad: "from-violet-100 to-violet-200",
    managerText: "text-violet-700",
    description: "Обсуждение условий годового договора на сопровождение. Клиент запросил расширенный пакет поддержки.",
    duration: "18 мин",
    callResult: "Состоялся",
  },
  {
    id: 2,
    type: "Письмо",
    datetime: "03 апр 2026, 11:15",
    datetimeRaw: "2026-04-03T11:15",
    client: "ООО «Техноком»",
    manager: "Алексей Воронов",
    managerInitials: "АВ",
    managerGrad: "from-blue-100 to-blue-200",
    managerText: "text-blue-700",
    description: "Отправлено коммерческое предложение на разработку мобильного приложения. Приложены технические требования.",
    subject: "КП: Разработка мобильного приложения",
  },
  {
    id: 3,
    type: "Встреча",
    datetime: "02 апр 2026, 10:00",
    datetimeRaw: "2026-04-02T10:00",
    client: "АО «МегаПроект»",
    manager: "Виктор Зайцев",
    managerInitials: "ВЗ",
    managerGrad: "from-amber-100 to-amber-200",
    managerText: "text-amber-700",
    description: "Презентация решения по автоматизации склада. Присутствовали директор по IT и финансовый директор.",
    duration: "1 ч 30 мин",
    location: "Офис клиента, Москва, Пресненская наб. 12",
  },
  {
    id: 4,
    type: "Заметка",
    datetime: "02 апр 2026, 09:20",
    datetimeRaw: "2026-04-02T09:20",
    client: "ЗАО «МедиаЛаб»",
    manager: "Светлана Власова",
    managerInitials: "СВ",
    managerGrad: "from-rose-100 to-rose-200",
    managerText: "text-rose-700",
    description: "Клиент запросил паузу в переговорах до 15 апреля в связи с внутренним аудитом. Напомнить 14 апреля.",
  },
  {
    id: 5,
    type: "Звонок",
    datetime: "01 апр 2026, 17:45",
    datetimeRaw: "2026-04-01T17:45",
    client: "ООО «СтройПроект»",
    manager: "Анна Петрова",
    managerInitials: "АП",
    managerGrad: "from-green-100 to-green-200",
    managerText: "text-green-700",
    description: "Уточнение деталей по договору технической поддержки. Клиент готов подписать в ближайшие дни.",
    duration: "8 мин",
    callResult: "Состоялся",
  },
  {
    id: 6,
    type: "Письмо",
    datetime: "01 апр 2026, 13:00",
    datetimeRaw: "2026-04-01T13:00",
    client: "ЗАО «АльянсПарт»",
    manager: "Юлия Романова",
    managerInitials: "ЮР",
    managerGrad: "from-teal-100 to-teal-200",
    managerText: "text-teal-700",
    description: "Направлен финальный вариант договора на консалтинговые услуги с учётом правок юридического отдела.",
    subject: "Договор консалтинг №К-2026-31 (финальная редакция)",
  },
  {
    id: 7,
    type: "Звонок",
    datetime: "31 мар 2026, 16:10",
    datetimeRaw: "2026-03-31T16:10",
    client: "АО «Северсталь Лайт»",
    manager: "Екатерина Громова",
    managerInitials: "ЕГ",
    managerGrad: "from-blue-100 to-blue-200",
    managerText: "text-blue-700",
    description: "Попытка связаться с директором по закупкам. Секретарь сообщил, что перезвонит завтра.",
    duration: "2 мин",
    callResult: "Не дозвонился",
  },
  {
    id: 8,
    type: "Встреча",
    datetime: "30 мар 2026, 15:00",
    datetimeRaw: "2026-03-30T15:00",
    client: "ООО «Альфа Технологии»",
    manager: "Мария Соколова",
    managerInitials: "МС",
    managerGrad: "from-rose-100 to-rose-200",
    managerText: "text-rose-700",
    description: "Первичная встреча-знакомство. Выявлены потребности: интеграция CRM с внутренней ERP-системой.",
    duration: "45 мин",
    location: "Zoom-конференция",
  },
  {
    id: 9,
    type: "Заметка",
    datetime: "29 мар 2026, 12:30",
    datetimeRaw: "2026-03-29T12:30",
    client: "АО «МегаПроект»",
    manager: "Виктор Зайцев",
    managerInitials: "ВЗ",
    managerGrad: "from-amber-100 to-amber-200",
    managerText: "text-amber-700",
    description: "По итогам встречи: ключевой контакт сменился — теперь это Николай Ершов, директор по развитию. Обновить контакты в карточке.",
  },
  {
    id: 10,
    type: "Звонок",
    datetime: "28 мар 2026, 11:00",
    datetimeRaw: "2026-03-28T11:00",
    client: "ИП Морозов К.В.",
    manager: "Мария Соколова",
    managerInitials: "МС",
    managerGrad: "from-rose-100 to-rose-200",
    managerText: "text-rose-700",
    description: "Первичная квалификация лида. Клиент заинтересован в базовом тарифе CRM. Договорились о демо на следующей неделе.",
    duration: "12 мин",
    callResult: "Перезвонить",
  },
];

const tabs: TabFilter[] = ["Все", "Письма", "Звонки", "Встречи", "Заметки"];

const managers = Array.from(new Set(allCommunications.map((c) => c.manager)));

export default function Communication() {
  const [activeTab, setActiveTab] = useState<TabFilter>("Все");
  const [managerFilter, setManagerFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [dbComms, setDbComms] = useState<Communication[] | null>(null);
  const [dbManagers, setDbManagers] = useState<string[]>([]);

  const loadComms = useCallback(async () => {
    try {
      const params: Record<string, string> = { per_page: '100' };
      if (search) params.search = search;
      if (activeTab !== 'Все') params.type = tabToType[activeTab] || '';
      if (managerFilter !== 'Все') params.manager = managerFilter;
      const res = await commsApi.list(params);
      if (res.communications) {
        const mapped: Communication[] = res.communications.map((c: Record<string, unknown>, i: number) => {
          const pal = commPalettes[i % commPalettes.length];
          const mgr = (c.manager as string) || '';
          const parts = mgr.trim().split(' ');
          const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : mgr.slice(0, 2).toUpperCase();
          const dt = c.comm_datetime ? new Date(c.comm_datetime as string) : new Date();
          const formatted = dt.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          return {
            id: c.id as number,
            type: c.type as CommType,
            datetime: formatted,
            datetimeRaw: c.comm_datetime as string || '',
            client: (c.client_name as string) || '',
            manager: mgr,
            managerInitials: initials,
            managerGrad: pal.bg,
            managerText: pal.text,
            description: c.description as string || '',
            duration: (c.duration as string) || undefined,
            callResult: (c.call_result as CallResult) || undefined,
            subject: (c.subject as string) || undefined,
            location: (c.location as string) || undefined,
          };
        });
        setDbComms(mapped);
        if (res.managers) setDbManagers(res.managers as string[]);
      }
    } catch {
      setDbComms(null);
    }
  }, [search, activeTab, managerFilter]);

  useEffect(() => { loadComms(); }, [loadComms]);

  const sourceComms = dbComms ?? allCommunications;
  const sourceManagers = dbManagers.length > 0 ? dbManagers : managers;

  const filtered = sourceComms.filter((c) => {
    const matchTab = activeTab === "Все" || c.type === tabToType[activeTab];
    const matchManager = managerFilter === "Все" || c.manager === managerFilter;
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      c.client.toLowerCase().includes(q) ||
      c.manager.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);
    return matchTab && matchManager && matchSearch;
  });

  const counts: Record<TabFilter, number> = {
    Все: allCommunications.length,
    Письма: allCommunications.filter((c) => c.type === "Письмо").length,
    Звонки: allCommunications.filter((c) => c.type === "Звонок").length,
    Встречи: allCommunications.filter((c) => c.type === "Встреча").length,
    Заметки: allCommunications.filter((c) => c.type === "Заметка").length,
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Коммуникации</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} записей в журнале</p>
        </div>
        {/* Quick add */}
        <div className="flex items-center gap-2">
          {(
            [
              { label: "+ Письмо", iconName: "Mail", color: "badge-violet" },
              { label: "+ Звонок", iconName: "Phone", color: "badge-green" },
              { label: "+ Встреча", iconName: "CalendarPlus", color: "badge-amber" },
              { label: "+ Заметка", iconName: "StickyNote", color: "badge-blue" },
            ] as const
          ).map((btn) => (
            <button
              key={btn.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent hover:opacity-80 transition-opacity ${btn.color}`}
            >
              <Icon name={btn.iconName} size={13} />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm px-5 py-4 flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/40 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeTab === tab ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted/50"
              }`}
              style={activeTab === tab ? { background: "hsl(var(--crm-blue))" } : {}}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                  activeTab === tab ? "bg-white/25 text-white" : "badge-blue"
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search + manager filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по клиенту, менеджеру, описанию..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/60 bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Icon name="X" size={13} />
              </button>
            )}
          </div>

          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border/60 bg-white text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer"
          >
            <option value="Все">Все менеджеры</option>
            {sourceManagers.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-muted/40 text-muted-foreground hover:bg-muted/70 transition-colors border border-border/40">
            <Icon name="CalendarRange" size={14} />
            апр 2026
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm flex flex-col items-center gap-3 py-16">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Icon name="SearchX" size={22} className="text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Записи не найдены</p>
              <p className="text-xs text-muted-foreground mt-1">Измените параметры фильтрации</p>
            </div>
          </div>
        ) : (
          filtered.map((comm) => (
            <div
              key={comm.id}
              className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex gap-4 group"
            >
              {/* Type icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeBg[comm.type]}`}>
                <Icon name={typeIcon[comm.type]} size={20} className={typeIconColor[comm.type]} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[comm.type]}`}>
                      {comm.type}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{comm.client}</span>
                    {comm.callResult && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${callResultBadge[comm.callResult]}`}>
                        {comm.callResult}
                      </span>
                    )}
                    {comm.subject && (
                      <span className="text-xs text-muted-foreground truncate max-w-[240px]">
                        «{comm.subject}»
                      </span>
                    )}
                  </div>

                  {/* Actions (hover) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors">
                      <Icon name="Pencil" size={13} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-colors">
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{comm.description}</p>

                {/* Location */}
                {comm.location && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Icon name="MapPin" size={11} className="shrink-0" />
                    {comm.location}
                  </div>
                )}

                {/* Footer row */}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  {/* Manager */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-md bg-gradient-to-br flex items-center justify-center text-[8px] font-bold shrink-0 ${comm.managerGrad} ${comm.managerText}`}
                    >
                      {comm.managerInitials}
                    </div>
                    <span className="text-xs text-muted-foreground">{comm.manager}</span>
                  </div>

                  {/* Datetime */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="Clock" size={11} />
                    {comm.datetime}
                  </div>

                  {/* Duration */}
                  {comm.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="Timer" size={11} />
                      {comm.duration}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}