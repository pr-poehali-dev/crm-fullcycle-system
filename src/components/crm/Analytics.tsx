import { useState } from "react";
import Icon from "@/components/ui/icon";

type Period = "Эта неделя" | "Месяц" | "Квартал" | "Год";

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

interface MonthBar {
  month: string;
  value: number;
  target: number;
}

interface Manager {
  id: number;
  name: string;
  initials: string;
  avatarGrad: string;
  avatarText: string;
  deals: number;
  revenue: number;
  pct: number;
}

interface StageBar {
  label: string;
  count: number;
  amount: number;
  pct: number;
  colorVar: string;
  badgeClass: string;
}

interface ForecastRow {
  label: string;
  value: string;
  sub: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

const periods: Period[] = ["Эта неделя", "Месяц", "Квартал", "Год"];

const kpiCards: KpiCard[] = [
  {
    label: "Выручка",
    value: "₽2.4М",
    delta: "+18%",
    positive: true,
    iconName: "TrendingUp",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Сделок закрыто",
    value: "34",
    delta: "+6",
    positive: true,
    iconName: "BadgeCheck",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Конверсия",
    value: "28%",
    delta: "+3%",
    positive: true,
    iconName: "Target",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    label: "NPS",
    value: "72",
    delta: "-2",
    positive: false,
    iconName: "Star",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

const monthBars: MonthBar[] = [
  { month: "Ноя", value: 68, target: 80 },
  { month: "Дек", value: 82, target: 80 },
  { month: "Янв", value: 55, target: 85 },
  { month: "Фев", value: 74, target: 85 },
  { month: "Мар", value: 91, target: 90 },
  { month: "Апр", value: 48, target: 90 },
];

const monthAmounts: Record<string, string> = {
  Ноя: "₽1.6М",
  Дек: "₽2.0М",
  Янв: "₽1.3М",
  Фев: "₽1.8М",
  Мар: "₽2.2М",
  Апр: "₽1.1М",
};

const managers: Manager[] = [
  {
    id: 1,
    name: "Дмитрий Лебедев",
    initials: "ДЛ",
    avatarGrad: "from-violet-100 to-violet-200",
    avatarText: "text-violet-700",
    deals: 12,
    revenue: 4800000,
    pct: 100,
  },
  {
    id: 2,
    name: "Анна Петрова",
    initials: "АП",
    avatarGrad: "from-green-100 to-green-200",
    avatarText: "text-green-700",
    deals: 9,
    revenue: 3200000,
    pct: 67,
  },
  {
    id: 3,
    name: "Алексей Воронов",
    initials: "АВ",
    avatarGrad: "from-blue-100 to-blue-200",
    avatarText: "text-blue-700",
    deals: 8,
    revenue: 2900000,
    pct: 60,
  },
  {
    id: 4,
    name: "Юлия Романова",
    initials: "ЮР",
    avatarGrad: "from-rose-100 to-rose-200",
    avatarText: "text-rose-700",
    deals: 6,
    revenue: 2100000,
    pct: 44,
  },
  {
    id: 5,
    name: "Виктор Зайцев",
    initials: "ВЗ",
    avatarGrad: "from-amber-100 to-amber-200",
    avatarText: "text-amber-700",
    deals: 5,
    revenue: 1750000,
    pct: 36,
  },
];

const stageBars: StageBar[] = [
  { label: "Новые", count: 8, amount: 2400000, pct: 100, colorVar: "hsl(var(--crm-blue))", badgeClass: "badge-blue" },
  { label: "Квалификация", count: 5, amount: 2555000, pct: 63, colorVar: "hsl(var(--crm-violet))", badgeClass: "badge-violet" },
  { label: "Предложение", count: 7, amount: 4574000, pct: 88, colorVar: "hsl(var(--crm-amber))", badgeClass: "badge-amber" },
  { label: "Переговоры", count: 4, amount: 5170000, pct: 50, colorVar: "hsl(var(--crm-rose))", badgeClass: "badge-rose" },
  { label: "Закрытие", count: 3, amount: 5010000, pct: 38, colorVar: "hsl(var(--crm-green))", badgeClass: "badge-green" },
];

const forecastRows: ForecastRow[] = [
  {
    label: "Ожидаемая выручка",
    value: "₽3.1М",
    sub: "до конца апреля",
    iconName: "CircleDollarSign",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Вероятность выполнения плана",
    value: "74%",
    sub: "план ₽4.2М",
    iconName: "Gauge",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Pipeline",
    value: "₽19.7М",
    sub: "27 активных сделок",
    iconName: "GitMerge",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
];

function formatRevenue(n: number): string {
  if (n >= 1_000_000) return `₽${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `₽${Math.round(n / 1_000)}К`;
  return `₽${n}`;
}

export default function Analytics() {
  const [period, setPeriod] = useState<Period>("Месяц");

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Аналитика</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ключевые показатели эффективности</p>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-xl border border-border/60 shadow-sm p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                period === p ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted/50"
              }`}
              style={period === p ? { background: "hsl(var(--crm-blue))" } : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
          <div key={i} className="stat-card flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.iconBg}`}>
                <Icon name={k.iconName} size={20} className={k.iconColor} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${k.positive ? "badge-green" : "badge-rose"}`}>
                {k.delta}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{k.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Forecast */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-border/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon name="BarChart3" size={15} className="text-blue-500" />
              </div>
              <span className="font-semibold text-sm text-foreground">Динамика выручки</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "hsl(var(--crm-blue))" }} />
                Факт
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block bg-muted" />
                План
              </span>
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-3 h-44">
            {monthBars.map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{monthAmounts[bar.month]}</span>
                <div className="w-full flex items-end gap-1 h-28">
                  {/* Target bar (background) */}
                  <div className="flex-1 relative rounded-t-lg bg-muted/60 overflow-hidden" style={{ height: `${bar.target}%` }}>
                    {/* Actual fill */}
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${Math.round((bar.value / bar.target) * 100)}%`,
                        background:
                          bar.value >= bar.target
                            ? "hsl(var(--crm-green))"
                            : bar.month === "Апр"
                            ? "hsl(var(--crm-blue) / 0.5)"
                            : "hsl(var(--crm-blue))",
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <Icon name="Telescope" size={15} className="text-violet-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">Прогноз</span>
          </div>
          {forecastRows.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/30">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${f.iconBg}`}>
                <Icon name={f.iconName} size={18} className={f.iconColor} />
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-foreground leading-tight">{f.value}</div>
                <div className="text-xs text-muted-foreground truncate">{f.label}</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard + Stage breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Managers leaderboard */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Icon name="Trophy" size={15} className="text-amber-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">Топ менеджеров</span>
          </div>
          <div className="flex flex-col divide-y divide-border/30">
            {managers.map((m, idx) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    idx === 0 ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-xs font-bold ${m.avatarGrad} ${m.avatarText}`}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                    <span className="text-xs font-bold text-foreground shrink-0">{formatRevenue(m.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 progress-bar">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${m.pct}%`, background: "hsl(var(--crm-blue))" }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{m.deals} сд.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals by stage */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
              <Icon name="PieChart" size={15} className="text-rose-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">Сделки по этапам</span>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4">
            {stageBars.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${s.badgeClass}`}>{s.label}</span>
                    <span className="text-muted-foreground">{s.count} сделок</span>
                  </div>
                  <span className="font-bold text-foreground">{formatRevenue(s.amount)}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.pct}%`, background: s.colorVar }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
