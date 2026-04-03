import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { clientsApi } from "@/lib/api";
import ClientModal from "@/components/crm/ClientModal";

type Segment = "VIP" | "Активный" | "Потенциальный" | "Новый";
type Industry = "IT" | "Строительство" | "Медиа" | "Производство" | "Торговля" | "Финансы";
type FilterTab = "Все" | "VIP" | "Активные" | "Потенциальные";

interface Client {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  segment: Segment;
  industry: Industry;
  lastContact: string;
  dealsCount: number;
  totalRevenue: number;
  avatarColor: string;
  avatarText: string;
}

interface PageStat {
  label: string;
  value: string;
  sub: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

const segmentBadge: Record<Segment, string> = {
  VIP: "badge-violet",
  Активный: "badge-green",
  Потенциальный: "badge-amber",
  Новый: "badge-blue",
};

const industryBadge: Record<Industry, string> = {
  IT: "badge-blue",
  Строительство: "badge-amber",
  Медиа: "badge-violet",
  Производство: "badge-teal",
  Торговля: "badge-green",
  Финансы: "badge-rose",
};

const avatarPalettes: { bg: string; text: string }[] = [
  { bg: "from-blue-100 to-blue-200", text: "text-blue-700" },
  { bg: "from-violet-100 to-violet-200", text: "text-violet-700" },
  { bg: "from-green-100 to-green-200", text: "text-green-700" },
  { bg: "from-amber-100 to-amber-200", text: "text-amber-700" },
  { bg: "from-rose-100 to-rose-200", text: "text-rose-700" },
  { bg: "from-teal-100 to-teal-200", text: "text-teal-700" },
];

const allClients: Client[] = [
  {
    id: 1,
    name: "Дмитрий Лебедев",
    company: "АО «Прогресс Групп»",
    phone: "+7 (495) 123-45-67",
    email: "lebedev@progress-grp.ru",
    segment: "VIP",
    industry: "Производство",
    lastContact: "01 апр 2026",
    dealsCount: 12,
    totalRevenue: 4800000,
    avatarColor: "from-violet-100 to-violet-200",
    avatarText: "text-violet-700",
  },
  {
    id: 2,
    name: "Анна Петрова",
    company: "ООО «СтройПроект»",
    phone: "+7 (812) 987-65-43",
    email: "petrova@stroyproject.ru",
    segment: "VIP",
    industry: "Строительство",
    lastContact: "31 мар 2026",
    dealsCount: 8,
    totalRevenue: 3200000,
    avatarColor: "from-rose-100 to-rose-200",
    avatarText: "text-rose-700",
  },
  {
    id: 3,
    name: "Алексей Воронов",
    company: "ООО «Техноком»",
    phone: "+7 (495) 555-11-22",
    email: "voronov@technocom.ru",
    segment: "Активный",
    industry: "IT",
    lastContact: "02 апр 2026",
    dealsCount: 5,
    totalRevenue: 1450000,
    avatarColor: "from-blue-100 to-blue-200",
    avatarText: "text-blue-700",
  },
  {
    id: 4,
    name: "Мария Соколова",
    company: "ИП Соколова М.В.",
    phone: "+7 (916) 234-56-78",
    email: "sokolova.mv@gmail.com",
    segment: "Активный",
    industry: "Торговля",
    lastContact: "29 мар 2026",
    dealsCount: 4,
    totalRevenue: 620000,
    avatarColor: "from-green-100 to-green-200",
    avatarText: "text-green-700",
  },
  {
    id: 5,
    name: "Виктор Зайцев",
    company: "АО «МегаПроект»",
    phone: "+7 (495) 777-88-99",
    email: "zaitsev@megaproject.ru",
    segment: "VIP",
    industry: "Строительство",
    lastContact: "28 мар 2026",
    dealsCount: 14,
    totalRevenue: 7600000,
    avatarColor: "from-amber-100 to-amber-200",
    avatarText: "text-amber-700",
  },
  {
    id: 6,
    name: "Светлана Власова",
    company: "ЗАО «МедиаЛаб»",
    phone: "+7 (812) 321-00-11",
    email: "vlasova@medialab.ru",
    segment: "Активный",
    industry: "Медиа",
    lastContact: "01 апр 2026",
    dealsCount: 6,
    totalRevenue: 980000,
    avatarColor: "from-violet-100 to-violet-200",
    avatarText: "text-violet-700",
  },
  {
    id: 7,
    name: "Игорь Смирнов",
    company: "ООО «Альфа Технологии»",
    phone: "+7 (926) 444-33-22",
    email: "smirnov@alfatech.ru",
    segment: "Потенциальный",
    industry: "IT",
    lastContact: "25 мар 2026",
    dealsCount: 1,
    totalRevenue: 320000,
    avatarColor: "from-teal-100 to-teal-200",
    avatarText: "text-teal-700",
  },
  {
    id: 8,
    name: "Екатерина Громова",
    company: "АО «Северсталь Лайт»",
    phone: "+7 (495) 600-70-80",
    email: "gromova@sever-light.ru",
    segment: "Потенциальный",
    industry: "Производство",
    lastContact: "22 мар 2026",
    dealsCount: 2,
    totalRevenue: 1200000,
    avatarColor: "from-blue-100 to-blue-200",
    avatarText: "text-blue-700",
  },
  {
    id: 9,
    name: "Константин Морозов",
    company: "ИП Морозов К.В.",
    phone: "+7 (917) 112-22-33",
    email: "morozov@yandex.ru",
    segment: "Новый",
    industry: "Торговля",
    lastContact: "03 апр 2026",
    dealsCount: 1,
    totalRevenue: 58000,
    avatarColor: "from-green-100 to-green-200",
    avatarText: "text-green-700",
  },
  {
    id: 10,
    name: "Юлия Романова",
    company: "ЗАО «АльянсПарт»",
    phone: "+7 (495) 888-55-44",
    email: "romanova@alliancepart.ru",
    segment: "VIP",
    industry: "Финансы",
    lastContact: "30 мар 2026",
    dealsCount: 9,
    totalRevenue: 5400000,
    avatarColor: "from-rose-100 to-rose-200",
    avatarText: "text-rose-700",
  },
];

const pageStats: PageStat[] = [
  {
    label: "Всего клиентов",
    value: "891",
    sub: "в базе",
    iconName: "Users",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Новых за месяц",
    value: "47",
    sub: "+24% к прошлому",
    iconName: "UserPlus",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Средний чек",
    value: "₽620К",
    sub: "по всем клиентам",
    iconName: "CircleDollarSign",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    label: "Удержание",
    value: "87%",
    sub: "retention rate",
    iconName: "HeartHandshake",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

const filterTabs: FilterTab[] = ["Все", "VIP", "Активные", "Потенциальные"];

const industries: Industry[] = ["IT", "Строительство", "Медиа", "Производство", "Торговля", "Финансы"];

function formatRevenue(n: number): string {
  if (n >= 1_000_000) return `₽${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `₽${Math.round(n / 1_000)}К`;
  return `₽${n}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const PAGE_SIZE = 8;

export default function Clients() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Все");
  const [activeIndustry, setActiveIndustry] = useState<Industry | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [dbClients, setDbClients] = useState<Client[] | null>(null);
  const [dbTotal, setDbTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      const params: Record<string, string> = { per_page: '100' };
      if (search) params.search = search;
      if (activeFilter !== 'Все') {
        const segMap: Record<string, string> = { VIP: 'VIP', Активные: 'Активный', Потенциальные: 'Потенциальный' };
        if (segMap[activeFilter]) params.segment = segMap[activeFilter];
      }
      if (activeIndustry) params.industry = activeIndustry;
      const res = await clientsApi.list(params);
      if (res.clients) {
        const mapped: Client[] = res.clients.map((c: Record<string, unknown>, i: number) => ({
          id: c.id as number,
          name: c.name as string,
          company: c.company as string,
          phone: (c.phone as string) || '',
          email: (c.email as string) || '',
          segment: (c.segment as Segment) || 'Новый',
          industry: (c.industry as Industry) || 'IT',
          lastContact: c.last_contact ? new Date(c.last_contact as string).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          dealsCount: 0,
          totalRevenue: (c.total_revenue as number) || 0,
          avatarColor: avatarPalettes[i % avatarPalettes.length].bg,
          avatarText: avatarPalettes[i % avatarPalettes.length].text,
        }));
        setDbClients(mapped);
        setDbTotal(res.total as number);
      }
    } catch {
      setDbClients(null);
    }
  }, [search, activeFilter, activeIndustry]);

  useEffect(() => { loadClients(); }, [loadClients]);

  const sourceClients = dbClients ?? allClients;

  const filtered = sourceClients.filter((c) => {
    const matchFilter =
      activeFilter === "Все" ||
      (activeFilter === "VIP" && c.segment === "VIP") ||
      (activeFilter === "Активные" && c.segment === "Активный") ||
      (activeFilter === "Потенциальные" && c.segment === "Потенциальный");

    const matchIndustry = activeIndustry === null || c.industry === activeIndustry;

    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q);

    return matchFilter && matchIndustry && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterTab(tab: FilterTab) {
    setActiveFilter(tab);
    setPage(1);
  }

  function handleIndustry(ind: Industry) {
    setActiveIndustry(activeIndustry === ind ? null : ind);
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Клиенты</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} из {dbClients ? dbTotal : allClients.length} клиентов
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "hsl(var(--crm-blue))" }}
        >
          <Icon name="UserPlus" size={15} />
          Добавить клиента
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {pageStats.map((s, i) => (
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

      {/* Search + filters */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm px-5 py-4 flex flex-col gap-4">
        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Поиск по имени, компании, email или телефону..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/60 bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": "hsl(var(--crm-blue) / 0.3)" } as React.CSSProperties}
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-muted/40 text-muted-foreground hover:bg-muted/70 transition-colors border border-border/40">
            <Icon name="SlidersHorizontal" size={15} />
            Фильтры
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-muted/40 text-muted-foreground hover:bg-muted/70 transition-colors border border-border/40">
            <Icon name="Download" size={15} />
            Экспорт
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
                activeFilter === tab
                  ? "text-white border-transparent shadow-sm"
                  : "bg-transparent border-border/50 text-muted-foreground hover:bg-muted/50"
              }`}
              style={
                activeFilter === tab
                  ? { background: "hsl(var(--crm-blue))" }
                  : {}
              }
            >
              {tab}
            </button>
          ))}

          <div className="w-px h-5 bg-border/60 mx-1" />

          {/* Industry tags */}
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => handleIndustry(ind)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                activeIndustry === ind
                  ? `${industryBadge[ind]} border-transparent`
                  : "bg-transparent border-border/40 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3.5 uppercase tracking-wide">
                  Клиент
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3.5 uppercase tracking-wide">
                  Контакты
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3.5 uppercase tracking-wide">
                  Сегмент
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3.5 uppercase tracking-wide">
                  Отрасль
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3.5 uppercase tracking-wide">
                  Последний контакт
                </th>
                <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3.5 uppercase tracking-wide">
                  Сделки
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3.5 uppercase tracking-wide">
                  Выручка
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                        <Icon name="SearchX" size={22} className="text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Клиенты не найдены</p>
                        <p className="text-xs mt-1">Попробуйте изменить параметры поиска</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((client, idx) => {
                  const isSelected = selectedId === client.id;
                  const palette = avatarPalettes[idx % avatarPalettes.length];
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedId(isSelected ? null : client.id)}
                      className={`group cursor-pointer transition-colors duration-150 border-b border-border/30 last:border-b-0 ${
                        isSelected
                          ? "bg-blue-50/60"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      {/* Client */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${palette.bg} flex items-center justify-center shrink-0 text-xs font-bold ${palette.text}`}
                          >
                            {getInitials(client.name)}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm leading-tight truncate transition-colors ${isSelected ? "text-blue-600" : "text-foreground group-hover:text-blue-600"}`}>
                              {client.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[160px]">
                              {client.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contacts */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon name="Phone" size={11} className="shrink-0" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon name="Mail" size={11} className="shrink-0" />
                            <span className="truncate max-w-[160px]">{client.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Segment */}
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${segmentBadge[client.segment]}`}>
                          {client.segment}
                        </span>
                      </td>

                      {/* Industry */}
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${industryBadge[client.industry]}`}>
                          {client.industry}
                        </span>
                      </td>

                      {/* Last contact */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon name="CalendarDays" size={12} className="shrink-0" />
                          {client.lastContact}
                        </div>
                      </td>

                      {/* Deals count */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg badge-blue text-xs font-bold">
                          {client.dealsCount}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-bold text-sm text-foreground tabular-nums">
                          {formatRevenue(client.totalRevenue)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/40 bg-muted/10">
          <p className="text-xs text-muted-foreground">
            Показано{" "}
            <span className="font-medium text-foreground">
              {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            из <span className="font-medium text-foreground">{filtered.length}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-white hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <Icon name="ChevronLeft" size={14} />
              Назад
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 border ${
                  p === safePage
                    ? "text-white border-transparent shadow-sm"
                    : "border-border/60 bg-white text-muted-foreground hover:bg-muted/40"
                }`}
                style={p === safePage ? { background: "hsl(var(--crm-blue))" } : {}}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-white hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              Вперёд
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        </div>
      </div>

      <ClientModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); loadClients(); }}
      />
    </div>
  );
}