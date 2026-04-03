import { useState } from "react";
import Icon from "@/components/ui/icon";

type DocType = "Счёт" | "Договор" | "Предложение" | "Отчёт";
type DocStatus = "Подписан" | "Ожидание" | "Черновик";
type TabFilter = "Все" | "Счета" | "Договоры" | "Предложения" | "Отчёты";
type StatusFilter = "Все статусы" | "Подписан" | "Ожидание" | "Черновик";

interface Document {
  id: number;
  name: string;
  type: DocType;
  client: string;
  date: string;
  dateRaw: string;
  size: string;
  status: DocStatus;
  pages: number;
  author: string;
}

const tabToType: Partial<Record<TabFilter, DocType>> = {
  Счета: "Счёт",
  Договоры: "Договор",
  Предложения: "Предложение",
  Отчёты: "Отчёт",
};

const typeIcon: Record<DocType, string> = {
  Счёт: "ReceiptText",
  Договор: "FileSignature",
  Предложение: "FileText",
  Отчёт: "BarChart2",
};

const typeBg: Record<DocType, string> = {
  Счёт: "bg-blue-50",
  Договор: "bg-violet-50",
  Предложение: "bg-amber-50",
  Отчёт: "bg-teal-50",
};

const typeIconColor: Record<DocType, string> = {
  Счёт: "text-blue-500",
  Договор: "text-violet-500",
  Предложение: "text-amber-500",
  Отчёт: "text-teal-500",
};

const typeBadge: Record<DocType, string> = {
  Счёт: "badge-blue",
  Договор: "badge-violet",
  Предложение: "badge-amber",
  Отчёт: "badge-teal",
};

const statusBadge: Record<DocStatus, string> = {
  Подписан: "badge-green",
  Ожидание: "badge-amber",
  Черновик: "badge-rose",
};

const statusIcon: Record<DocStatus, string> = {
  Подписан: "CheckCircle2",
  Ожидание: "Clock",
  Черновик: "FilePen",
};

const allDocuments: Document[] = [
  {
    id: 1,
    name: "Договор на разработку ПО №2026-041",
    type: "Договор",
    client: "АО «Прогресс Групп»",
    date: "01 апр 2026",
    dateRaw: "2026-04-01",
    size: "1.4 МБ",
    status: "Подписан",
    pages: 18,
    author: "Дмитрий Лебедев",
  },
  {
    id: 2,
    name: "Счёт на оплату №СФ-2026-089",
    type: "Счёт",
    client: "ООО «Техноком»",
    date: "31 мар 2026",
    dateRaw: "2026-03-31",
    size: "320 КБ",
    status: "Ожидание",
    pages: 2,
    author: "Алексей Воронов",
  },
  {
    id: 3,
    name: "Коммерческое предложение для МегаПроект",
    type: "Предложение",
    client: "АО «МегаПроект»",
    date: "29 мар 2026",
    dateRaw: "2026-03-29",
    size: "2.1 МБ",
    status: "Ожидание",
    pages: 24,
    author: "Виктор Зайцев",
  },
  {
    id: 4,
    name: "Отчёт по итогам Q1 2026",
    type: "Отчёт",
    client: "ЗАО «АльянсПарт»",
    date: "02 апр 2026",
    dateRaw: "2026-04-02",
    size: "3.8 МБ",
    status: "Подписан",
    pages: 42,
    author: "Юлия Романова",
  },
  {
    id: 5,
    name: "Договор технической поддержки №ТП-2026-17",
    type: "Договор",
    client: "ООО «СтройПроект»",
    date: "28 мар 2026",
    dateRaw: "2026-03-28",
    size: "980 КБ",
    status: "Подписан",
    pages: 12,
    author: "Анна Петрова",
  },
  {
    id: 6,
    name: "Счёт-фактура №СФ-2026-092",
    type: "Счёт",
    client: "ЗАО «МедиаЛаб»",
    date: "30 мар 2026",
    dateRaw: "2026-03-30",
    size: "285 КБ",
    status: "Черновик",
    pages: 2,
    author: "Светлана Власова",
  },
  {
    id: 7,
    name: "Предложение по облачной инфраструктуре",
    type: "Предложение",
    client: "АО «Северсталь Лайт»",
    date: "25 мар 2026",
    dateRaw: "2026-03-25",
    size: "1.7 МБ",
    status: "Черновик",
    pages: 19,
    author: "Екатерина Громова",
  },
  {
    id: 8,
    name: "Аналитический отчёт — конверсия апрель",
    type: "Отчёт",
    client: "Внутренний",
    date: "03 апр 2026",
    dateRaw: "2026-04-03",
    size: "2.5 МБ",
    status: "Черновик",
    pages: 31,
    author: "Мария Соколова",
  },
];

const tabs: TabFilter[] = ["Все", "Счета", "Договоры", "Предложения", "Отчёты"];
const statusFilters: StatusFilter[] = ["Все статусы", "Подписан", "Ожидание", "Черновик"];

export default function Documents() {
  const [activeTab, setActiveTab] = useState<TabFilter>("Все");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Все статусы");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered = allDocuments.filter((doc) => {
    const matchTab =
      activeTab === "Все" || doc.type === tabToType[activeTab];

    const matchStatus =
      statusFilter === "Все статусы" || doc.status === statusFilter;

    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      doc.name.toLowerCase().includes(q) ||
      doc.client.toLowerCase().includes(q) ||
      doc.author.toLowerCase().includes(q);

    return matchTab && matchStatus && matchSearch;
  });

  const counts: Record<TabFilter, number> = {
    Все: allDocuments.length,
    Счета: allDocuments.filter((d) => d.type === "Счёт").length,
    Договоры: allDocuments.filter((d) => d.type === "Договор").length,
    Предложения: allDocuments.filter((d) => d.type === "Предложение").length,
    Отчёты: allDocuments.filter((d) => d.type === "Отчёт").length,
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Документы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} из {allDocuments.length} документов
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-border/60 shadow-sm text-muted-foreground hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <Icon name="Upload" size={15} />
            Загрузить
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: "hsl(var(--crm-blue))" }}
          >
            <Icon name="FilePlus" size={15} />
            Создать документ
          </button>
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {(
          [
            { label: "Счета", count: counts["Счета"], icon: "ReceiptText", bg: "bg-blue-50", color: "text-blue-500" },
            { label: "Договоры", count: counts["Договоры"], icon: "FileSignature", bg: "bg-violet-50", color: "text-violet-500" },
            { label: "Предложения", count: counts["Предложения"], icon: "FileText", bg: "bg-amber-50", color: "text-amber-500" },
            { label: "Отчёты", count: counts["Отчёты"], icon: "BarChart2", bg: "bg-teal-50", color: "text-teal-500" },
          ] as const
        ).map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <Icon name={s.icon} size={18} className={s.color} />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground leading-tight">{s.count}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + filters */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm px-5 py-4 flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/40 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeTab === tab
                  ? "text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50"
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

        {/* Search + status filter */}
        <div className="flex items-center gap-3 flex-wrap">
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
              placeholder="Поиск по названию, клиенту, автору..."
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

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5">
            {statusFilters.map((sf) => (
              <button
                key={sf}
                onClick={() => setStatusFilter(sf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  statusFilter === sf
                    ? sf === "Подписан"
                      ? "badge-green border-transparent"
                      : sf === "Ожидание"
                      ? "badge-amber border-transparent"
                      : sf === "Черновик"
                      ? "badge-rose border-transparent"
                      : "text-white border-transparent"
                    : "bg-transparent border-border/50 text-muted-foreground hover:bg-muted/40"
                }`}
                style={
                  statusFilter === sf && sf === "Все статусы"
                    ? { background: "hsl(var(--crm-blue))", color: "#fff" }
                    : {}
                }
              >
                {sf}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-muted/40 text-muted-foreground hover:bg-muted/70 transition-colors border border-border/40">
            <Icon name="CalendarRange" size={14} />
            апр 2026
          </button>
        </div>
      </div>

      {/* Document grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm flex flex-col items-center gap-3 py-20">
          <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center">
            <Icon name="FileSearch" size={26} className="text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Документы не найдены</p>
            <p className="text-xs text-muted-foreground mt-1">Попробуйте изменить параметры фильтрации</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((doc) => {
            const isHovered = hoveredId === doc.id;
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
                onMouseEnter={() => setHoveredId(doc.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Main card content */}
                <div className="p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${typeBg[doc.type]} ${isHovered ? "scale-105" : ""}`}
                  >
                    <Icon name={typeIcon[doc.type]} size={24} className={typeIconColor[doc.type]} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {doc.name}
                      </p>
                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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

                    {/* Client + author */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                      <Icon name="Building2" size={11} className="shrink-0" />
                      <span className="truncate">{doc.client}</span>
                      <span className="text-border/80">·</span>
                      <Icon name="User" size={11} className="shrink-0" />
                      <span className="truncate">{doc.author}</span>
                    </div>

                    {/* Tags row */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[doc.type]}`}>
                        {doc.type}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge[doc.status]}`}
                      >
                        <Icon name={statusIcon[doc.status]} size={9} />
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className={`px-5 py-3 border-t border-border/30 transition-colors duration-200 ${isHovered ? "bg-muted/20" : "bg-muted/5"}`}
                >
                  {/* Preview on hover */}
                  {isHovered ? (
                    <div className="flex items-center justify-between text-xs animate-fade-in">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="FileStack" size={11} />
                          {doc.pages} стр.
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="HardDrive" size={11} />
                          {doc.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="CalendarDays" size={11} />
                          {doc.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg badge-blue text-[10px] font-semibold hover:opacity-80 transition-opacity">
                          <Icon name="Download" size={10} />
                          Скачать
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 text-muted-foreground text-[10px] font-semibold hover:bg-muted transition-colors">
                          <Icon name="Share2" size={10} />
                          Поделиться
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="CalendarDays" size={11} />
                        {doc.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="FileStack" size={11} />
                        {doc.pages} стр. · {doc.size}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
