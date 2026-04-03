import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { dealsApi } from "@/lib/api";

const managerPalettes = [
  "from-blue-100 to-blue-200 text-blue-700",
  "from-violet-100 to-violet-200 text-violet-700",
  "from-green-100 to-green-200 text-green-700",
  "from-amber-100 to-amber-200 text-amber-700",
  "from-rose-100 to-rose-200 text-rose-700",
  "from-teal-100 to-teal-200 text-teal-700",
];

type DealStatus = "Активная" | "Выиграна" | "Проиграна";
type DealStage = "Новая" | "Квалификация" | "Предложение" | "Переговоры" | "Закрытие";
type SortField = "amount" | "closeDate" | "stage" | "probability";
type SortDir = "asc" | "desc";
type FilterTab = "Все" | "Активные" | "Выиграно" | "Проиграно";

interface Deal {
  id: number;
  name: string;
  client: string;
  stage: DealStage;
  status: DealStatus;
  amount: number;
  probability: number;
  manager: string;
  managerInitials: string;
  managerColor: string;
  closeDate: string;
  closeDateRaw: string;
  createdDate: string;
}

interface TopStat {
  label: string;
  value: string;
  sub: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

const stageBadge: Record<DealStage, string> = {
  Новая: "badge-blue",
  Квалификация: "badge-violet",
  Предложение: "badge-amber",
  Переговоры: "badge-rose",
  Закрытие: "badge-green",
};

const statusBadge: Record<DealStatus, string> = {
  Активная: "badge-blue",
  Выиграна: "badge-green",
  Проиграна: "badge-rose",
};

const stageOrder: Record<DealStage, number> = {
  Новая: 1,
  Квалификация: 2,
  Предложение: 3,
  Переговоры: 4,
  Закрытие: 5,
};

const topStats: TopStat[] = [
  {
    label: "Открытых сделок",
    value: "47",
    sub: "+5 за неделю",
    iconName: "Briefcase",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "На сумму",
    value: "₽8.2М",
    sub: "в активных сделках",
    iconName: "Wallet",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    label: "Закрыто в апреле",
    value: "12",
    sub: "выигранных сделок",
    iconName: "BadgeCheck",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Прогноз",
    value: "₽3.1М",
    sub: "до конца месяца",
    iconName: "TrendingUp",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

const allDeals: Deal[] = [
  {
    id: 1,
    name: "Корпоративная лицензия ERP",
    client: "АО «Прогресс Групп»",
    stage: "Переговоры",
    status: "Активная",
    amount: 3100000,
    probability: 70,
    manager: "Дмитрий Лебедев",
    managerInitials: "ДЛ",
    managerColor: "from-violet-100 to-violet-200 text-violet-700",
    closeDate: "15 апр 2026",
    closeDateRaw: "2026-04-15",
    createdDate: "01 мар 2026",
  },
  {
    id: 2,
    name: "Разработка мобильного приложения",
    client: "ООО «Техноком»",
    stage: "Предложение",
    status: "Активная",
    amount: 480000,
    probability: 55,
    manager: "Алексей Воронов",
    managerInitials: "АВ",
    managerColor: "from-blue-100 to-blue-200 text-blue-700",
    closeDate: "30 апр 2026",
    closeDateRaw: "2026-04-30",
    createdDate: "10 мар 2026",
  },
  {
    id: 3,
    name: "Аудит информационной безопасности",
    client: "ЗАО «МедиаЛаб»",
    stage: "Закрытие",
    status: "Выиграна",
    amount: 920000,
    probability: 100,
    manager: "Светлана Власова",
    managerInitials: "СВ",
    managerColor: "from-rose-100 to-rose-200 text-rose-700",
    closeDate: "28 мар 2026",
    closeDateRaw: "2026-03-28",
    createdDate: "15 фев 2026",
  },
  {
    id: 4,
    name: "Поставка серверного оборудования",
    client: "АО «МегаПроект»",
    stage: "Квалификация",
    status: "Активная",
    amount: 2400000,
    probability: 40,
    manager: "Виктор Зайцев",
    managerInitials: "ВЗ",
    managerColor: "from-amber-100 to-amber-200 text-amber-700",
    closeDate: "20 май 2026",
    closeDateRaw: "2026-05-20",
    createdDate: "25 мар 2026",
  },
  {
    id: 5,
    name: "Подписка на облачный сервис",
    client: "ООО «СтройПроект»",
    stage: "Закрытие",
    status: "Активная",
    amount: 1450000,
    probability: 85,
    manager: "Анна Петрова",
    managerInitials: "АП",
    managerColor: "from-green-100 to-green-200 text-green-700",
    closeDate: "10 апр 2026",
    closeDateRaw: "2026-04-10",
    createdDate: "05 мар 2026",
  },
  {
    id: 6,
    name: "Консалтинг по цифровой трансформации",
    client: "ЗАО «АльянсПарт»",
    stage: "Переговоры",
    status: "Выиграна",
    amount: 2800000,
    probability: 100,
    manager: "Юлия Романова",
    managerInitials: "ЮР",
    managerColor: "from-teal-100 to-teal-200 text-teal-700",
    closeDate: "31 мар 2026",
    closeDateRaw: "2026-03-31",
    createdDate: "01 фев 2026",
  },
  {
    id: 7,
    name: "Интеграция CRM с 1С",
    client: "ИП Морозов К.В.",
    stage: "Новая",
    status: "Активная",
    amount: 58000,
    probability: 20,
    manager: "Мария Соколова",
    managerInitials: "МС",
    managerColor: "from-rose-100 to-rose-200 text-rose-700",
    closeDate: "01 июн 2026",
    closeDateRaw: "2026-06-01",
    createdDate: "02 апр 2026",
  },
  {
    id: 8,
    name: "Техническая поддержка (годовой контракт)",
    client: "АО «Северсталь Лайт»",
    stage: "Квалификация",
    status: "Проиграна",
    amount: 1200000,
    probability: 0,
    manager: "Екатерина Громова",
    managerInitials: "ЕГ",
    managerColor: "from-blue-100 to-blue-200 text-blue-700",
    closeDate: "15 мар 2026",
    closeDateRaw: "2026-03-15",
    createdDate: "10 фев 2026",
  },
];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `₽${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `₽${Math.round(n / 1_000)}К`;
  return `₽${n}`;
}

const filterTabs: FilterTab[] = ["Все", "Активные", "Выиграно", "Проиграно"];

const sortLabels: Record<SortField, string> = {
  amount: "Сумма",
  closeDate: "Дата закрытия",
  stage: "Этап",
  probability: "Вероятность",
};

export default function Deals() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Все");
  const [sortField, setSortField] = useState<SortField>("amount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [dbDeals, setDbDeals] = useState<Deal[] | null>(null);

  const loadDeals = useCallback(async () => {
    try {
      const params: Record<string, string> = { per_page: '100' };
      if (search) params.search = search;
      if (activeFilter !== 'Все') {
        const statusMap: Record<string, string> = { Активные: 'Активная', Выиграно: 'Выиграна', Проиграно: 'Проиграна' };
        if (statusMap[activeFilter]) params.status = statusMap[activeFilter];
      }
      const res = await dealsApi.list(params);
      if (res.deals) {
        const mapped: Deal[] = res.deals.map((d: Record<string, unknown>, i: number) => {
          const mgr = (d.manager as string) || '';
          const parts = mgr.trim().split(' ');
          const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : mgr.slice(0, 2).toUpperCase();
          const cd = d.close_date ? new Date(d.close_date as string) : null;
          const cr = d.created_at ? new Date(d.created_at as string) : null;
          return {
            id: d.id as number,
            name: d.name as string,
            client: (d.client_name as string) || '',
            stage: (d.stage as DealStage) || 'Новая',
            status: (d.status as DealStatus) || 'Активная',
            amount: (d.amount as number) || 0,
            probability: (d.probability as number) || 0,
            manager: mgr,
            managerInitials: initials,
            managerColor: managerPalettes[i % managerPalettes.length],
            closeDate: cd ? cd.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
            closeDateRaw: d.close_date as string || '',
            createdDate: cr ? cr.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          };
        });
        setDbDeals(mapped);
      }
    } catch {
      setDbDeals(null);
    }
  }, [search, activeFilter]);

  useEffect(() => { loadDeals(); }, [loadDeals]);

  const sourceDeals = dbDeals ?? allDeals;

  const filtered = sourceDeals
    .filter((d) => {
      const matchTab =
        activeFilter === "Все" ||
        (activeFilter === "Активные" && d.status === "Активная") ||
        (activeFilter === "Выиграно" && d.status === "Выиграна") ||
        (activeFilter === "Проиграно" && d.status === "Проиграна");

      const q = search.toLowerCase();
      const matchSearch =
        q === "" ||
        d.name.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q) ||
        d.manager.toLowerCase().includes(q);

      return matchTab && matchSearch;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "probability") cmp = a.probability - b.probability;
      else if (sortField === "stage") cmp = stageOrder[a.stage] - stageOrder[b.stage];
      else if (sortField === "closeDate")
        cmp = a.closeDateRaw.localeCompare(b.closeDateRaw);
      return sortDir === "asc" ? cmp : -cmp;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <Icon name="ChevronsUpDown" size={12} className="text-muted-foreground/40" />;
    return sortDir === "asc" ? (
      <Icon name="ChevronUp" size={12} className="text-blue-500" />
    ) : (
      <Icon name="ChevronDown" size={12} className="text-blue-500" />
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Сделки</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} из {sourceDeals.length} сделок
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "hsl(var(--crm-blue))" }}
        >
          <Icon name="Plus" size={15} />
          Создать сделку
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {topStats.map((s, i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
              <Icon name={s.iconName} size={20} className={s.iconColor} />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-foreground tracking-tight leading-tight">{s.value}</div>
              <div className="text-xs font-medium text-muted-foreground truncate">{s.label}</div>
              <div className="text-xs text-muted-foreground/60 truncate">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Icon
              name="Search"
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, клиенту, менеджеру..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/60 bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={13} />
              </button>
            )}
          </div>

          {/* Date range stub */}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-muted/40 text-muted-foreground hover:bg-muted/70 transition-colors border border-border/40">
            <Icon name="CalendarRange" size={14} />
            апр 2026
            <Icon name="ChevronDown" size={13} />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-muted/40 text-muted-foreground hover:bg-muted/70 transition-colors border border-border/40">
            <Icon name="SlidersHorizontal" size={14} />
            Фильтры
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
                activeFilter === tab
                  ? "text-white border-transparent shadow-sm"
                  : "bg-transparent border-border/50 text-muted-foreground hover:bg-muted/50"
              }`}
              style={activeFilter === tab ? { background: "hsl(var(--crm-blue))" } : {}}
            >
              {tab}
            </button>
          ))}

          {/* Sort controls */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1">Сортировка:</span>
            {(Object.keys(sortLabels) as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                  sortField === field
                    ? "badge-blue border-transparent"
                    : "border-border/50 text-muted-foreground hover:bg-muted/40 bg-transparent"
                }`}
              >
                {sortLabels[field]}
                <SortIcon field={field} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deals list */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Table head */}
        <div className="grid grid-cols-[2fr_1.4fr_120px_110px_100px_90px_100px_88px] gap-x-4 px-5 py-3 border-b border-border/40 bg-muted/20">
          {[
            "Сделка",
            "Клиент",
            "Этап",
            "Сумма",
            "Вероятность",
            "Менеджер",
            "Закрытие",
            "",
          ].map((h, i) => (
            <div
              key={i}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Icon name="SearchX" size={22} className="text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Сделки не найдены</p>
              <p className="text-xs mt-1">Попробуйте изменить параметры фильтрации</p>
            </div>
          </div>
        ) : (
          filtered.map((deal, idx) => (
            <div
              key={deal.id}
              className={`group grid grid-cols-[2fr_1.4fr_120px_110px_100px_90px_100px_88px] gap-x-4 px-5 py-3.5 items-center transition-colors duration-150 hover:bg-muted/30 cursor-pointer ${
                idx !== filtered.length - 1 ? "border-b border-border/30" : ""
              }`}
            >
              {/* Deal name */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                  {deal.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[deal.status]}`}>
                    {deal.status}
                  </span>
                  <span className="text-xs text-muted-foreground">создана {deal.createdDate}</span>
                </div>
              </div>

              {/* Client */}
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{deal.client}</p>
              </div>

              {/* Stage */}
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stageBadge[deal.stage]}`}>
                  {deal.stage}
                </span>
              </div>

              {/* Amount */}
              <div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatAmount(deal.amount)}
                </span>
              </div>

              {/* Probability */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-foreground">{deal.probability}%</span>
                <div className="progress-bar w-full">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${deal.probability}%`,
                      background:
                        deal.probability >= 80
                          ? "hsl(var(--crm-green))"
                          : deal.probability >= 50
                          ? "hsl(var(--crm-blue))"
                          : deal.probability === 0
                          ? "hsl(var(--crm-rose))"
                          : "hsl(var(--crm-amber))",
                    }}
                  />
                </div>
              </div>

              {/* Manager */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-[10px] font-bold shrink-0 ${deal.managerColor}`}
                >
                  {deal.managerInitials}
                </div>
              </div>

              {/* Close date */}
              <div>
                <span className="text-xs text-muted-foreground">{deal.closeDate}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors">
                  <Icon name="Eye" size={14} />
                </button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-amber-50 hover:text-amber-500 transition-colors">
                  <Icon name="Pencil" size={14} />
                </button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}