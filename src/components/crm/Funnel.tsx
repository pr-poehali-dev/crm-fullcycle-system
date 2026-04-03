import Icon from "@/components/ui/icon";

type Priority = "высокий" | "средний" | "низкий";
type StageId = "new" | "qualify" | "proposal" | "negotiate" | "close";

interface Deal {
  id: number;
  company: string;
  amount: number;
  person: string;
  daysInStage: number;
  priority: Priority;
}

interface Stage {
  id: StageId;
  label: string;
  colorVar: string;
  softVar: string;
  badgeClass: string;
  iconName: string;
  headerBg: string;
  borderColor: string;
  deals: Deal[];
}

const priorityBadge: Record<Priority, string> = {
  высокий: "badge-rose",
  средний: "badge-amber",
  низкий: "badge-teal",
};

const priorityIcon: Record<Priority, string> = {
  высокий: "ArrowUp",
  средний: "Minus",
  низкий: "ArrowDown",
};

const stages: Stage[] = [
  {
    id: "new",
    label: "Новые",
    colorVar: "--crm-blue",
    softVar: "--crm-blue-soft",
    badgeClass: "badge-blue",
    iconName: "Inbox",
    headerBg: "bg-blue-50",
    borderColor: "border-blue-200",
    deals: [
      { id: 1, company: "ООО «Альфа Технологии»", amount: 320000, person: "Игорь Смирнов", daysInStage: 2, priority: "высокий" },
      { id: 2, company: "ИП Кузнецов В.А.", amount: 85000, person: "Валентина Кузьмина", daysInStage: 1, priority: "средний" },
      { id: 3, company: "АО «РусМедиа»", amount: 540000, person: "Антон Беляев", daysInStage: 3, priority: "высокий" },
      { id: 4, company: "ООО «Горизонт»", amount: 112000, person: "Наталья Орлова", daysInStage: 1, priority: "низкий" },
      { id: 5, company: "ЗАО «СинтезПром»", amount: 780000, person: "Михаил Титов", daysInStage: 4, priority: "высокий" },
      { id: 6, company: "ООО «Светлый путь»", amount: 63000, person: "Ирина Фомина", daysInStage: 2, priority: "низкий" },
      { id: 7, company: "ИП Захаров Д.С.", amount: 97000, person: "Дмитрий Захаров", daysInStage: 1, priority: "средний" },
      { id: 8, company: "АО «Промстрой»", amount: 415000, person: "Сергей Медведев", daysInStage: 3, priority: "средний" },
    ],
  },
  {
    id: "qualify",
    label: "Квалификация",
    colorVar: "--crm-violet",
    softVar: "--crm-violet-soft",
    badgeClass: "badge-violet",
    iconName: "SearchCheck",
    headerBg: "bg-violet-50",
    borderColor: "border-violet-200",
    deals: [
      { id: 9, company: "ООО «ТехноВектор»", amount: 670000, person: "Алексей Воронов", daysInStage: 5, priority: "высокий" },
      { id: 10, company: "АО «Северсталь Лайт»", amount: 1200000, person: "Екатерина Громова", daysInStage: 7, priority: "высокий" },
      { id: 11, company: "ООО «ДатаСфера»", amount: 380000, person: "Павел Круглов", daysInStage: 3, priority: "средний" },
      { id: 12, company: "ЗАО «ИнтерЛогик»", amount: 245000, person: "Ольга Ларина", daysInStage: 6, priority: "средний" },
      { id: 13, company: "ИП Морозов К.В.", amount: 58000, person: "Константин Морозов", daysInStage: 4, priority: "низкий" },
    ],
  },
  {
    id: "proposal",
    label: "Предложение",
    colorVar: "--crm-amber",
    softVar: "--crm-amber-soft",
    badgeClass: "badge-amber",
    iconName: "FileText",
    headerBg: "bg-amber-50",
    borderColor: "border-amber-200",
    deals: [
      { id: 14, company: "ООО «Сфера Бизнес»", amount: 890000, person: "Марина Соколова", daysInStage: 8, priority: "высокий" },
      { id: 15, company: "АО «МегаПроект»", amount: 2400000, person: "Виктор Зайцев", daysInStage: 11, priority: "высокий" },
      { id: 16, company: "ООО «КлючСофт»", amount: 320000, person: "Анна Белова", daysInStage: 5, priority: "средний" },
      { id: 17, company: "ЗАО «АртПринт»", amount: 145000, person: "Роман Попов", daysInStage: 9, priority: "низкий" },
      { id: 18, company: "ИП Федотова Н.П.", amount: 74000, person: "Надежда Федотова", daysInStage: 6, priority: "низкий" },
      { id: 19, company: "АО «ЦифраГрупп»", amount: 560000, person: "Леонид Соловьёв", daysInStage: 7, priority: "средний" },
      { id: 20, company: "ООО «НовоТрейд»", amount: 185000, person: "Тамара Ковалёва", daysInStage: 4, priority: "средний" },
    ],
  },
  {
    id: "negotiate",
    label: "Переговоры",
    colorVar: "--crm-rose",
    softVar: "--crm-rose-soft",
    badgeClass: "badge-rose",
    iconName: "Handshake",
    headerBg: "bg-rose-50",
    borderColor: "border-rose-200",
    deals: [
      { id: 21, company: "АО «Прогресс Групп»", amount: 3100000, person: "Дмитрий Лебедев", daysInStage: 14, priority: "высокий" },
      { id: 22, company: "ООО «Техноком»", amount: 480000, person: "Алексей Воронов", daysInStage: 9, priority: "высокий" },
      { id: 23, company: "ЗАО «МедиаЛаб»", amount: 920000, person: "Светлана Власова", daysInStage: 12, priority: "средний" },
      { id: 24, company: "ООО «ЭкоСтрой»", amount: 670000, person: "Андрей Логинов", daysInStage: 16, priority: "средний" },
    ],
  },
  {
    id: "close",
    label: "Закрытие",
    colorVar: "--crm-green",
    softVar: "--crm-green-soft",
    badgeClass: "badge-green",
    iconName: "BadgeCheck",
    headerBg: "bg-green-50",
    borderColor: "border-green-200",
    deals: [
      { id: 25, company: "ООО «СтройПроект»", amount: 1450000, person: "Анна Петрова", daysInStage: 3, priority: "высокий" },
      { id: 26, company: "АО «ИнфоТех»", amount: 760000, person: "Николай Ершов", daysInStage: 2, priority: "высокий" },
      { id: 27, company: "ЗАО «АльянсПарт»", amount: 2800000, person: "Юлия Романова", daysInStage: 5, priority: "высокий" },
    ],
  },
];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `₽${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `₽${Math.round(n / 1_000)}К`;
  return `₽${n}`;
}

function stageTotal(deals: Deal[]): number {
  return deals.reduce((sum, d) => sum + d.amount, 0);
}

function initials(company: string): string {
  const clean = company.replace(/[«»"']/g, "").replace(/^(ООО|ИП|АО|ЗАО)\s*/i, "");
  return clean.slice(0, 2).toUpperCase();
}

const avatarGradients = [
  "from-blue-100 to-blue-200",
  "from-violet-100 to-violet-200",
  "from-amber-100 to-amber-200",
  "from-rose-100 to-rose-200",
  "from-green-100 to-green-200",
  "from-teal-100 to-teal-200",
];

const avatarTextColors = [
  "text-blue-700",
  "text-violet-700",
  "text-amber-700",
  "text-rose-700",
  "text-green-700",
  "text-teal-700",
];

interface FunnelStatItem {
  label: string;
  value: string;
  sub: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

const funnelStats: FunnelStatItem[] = [
  {
    label: "Конверсия",
    value: "34%",
    sub: "+3% к прошлому месяцу",
    iconName: "TrendingUp",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Средний чек",
    value: "₽620К",
    sub: "по 27 закрытым сделкам",
    iconName: "CircleDollarSign",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Прогноз месяца",
    value: "₽8.4М",
    sub: "72% плана выполнено",
    iconName: "BarChart3",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    label: "Дней до закрытия",
    value: "18",
    sub: "среднее по воронке",
    iconName: "CalendarClock",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

const conversionSteps = [
  { from: "Новые", to: "Квалификация", pct: 63 },
  { from: "Квалификация", to: "Предложение", pct: 78 },
  { from: "Предложение", to: "Переговоры", pct: 57 },
  { from: "Переговоры", to: "Закрытие", pct: 75 },
];

const stageBarColors = [
  "hsl(var(--crm-blue))",
  "hsl(var(--crm-violet))",
  "hsl(var(--crm-amber))",
  "hsl(var(--crm-rose))",
  "hsl(var(--crm-green))",
];

export default function Funnel() {
  const totalDeals = stages.reduce((s, st) => s + st.deals.length, 0);
  const totalAmount = stages.reduce((s, st) => s + stageTotal(st.deals), 0);

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Воронка продаж
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalDeals} сделок · {formatAmount(totalAmount)} в работе
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-border/60 shadow-sm text-muted-foreground hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <Icon name="SlidersHorizontal" size={15} />
            Фильтры
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: "hsl(var(--crm-blue))" }}
          >
            <Icon name="Plus" size={15} />
            Новая сделка
          </button>
        </div>
      </div>

      {/* Funnel stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {funnelStats.map((stat, i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              <Icon name={stat.iconName} size={22} className={stat.iconColor} />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-foreground tracking-tight leading-tight">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5 truncate">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion progress bar */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="GitMerge" size={15} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Конверсия по этапам</span>
        </div>
        <div className="flex items-center gap-0">
          {stages.map((stage, idx) => {
            const pct = Math.round((stage.deals.length / totalDeals) * 100);
            return (
              <div key={stage.id} className="flex items-center flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div
                    className="h-7 rounded-lg flex items-center justify-center text-xs font-semibold text-white truncate px-2 transition-all duration-300"
                    style={{ background: stageBarColors[idx], opacity: 0.85 + idx * 0.03 }}
                  >
                    {pct}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 text-center truncate px-1">
                    {stage.label}
                  </div>
                </div>
                {idx < stages.length - 1 && (
                  <div className="flex flex-col items-center mx-1 shrink-0">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1">
                      {conversionSteps[idx].pct}%
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage, stageIdx) => {
          const total = stageTotal(stage.deals);
          return (
            <div
              key={stage.id}
              className="stage-column flex flex-col gap-2 min-w-[272px] max-w-[272px]"
            >
              {/* Column header */}
              <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${stage.headerBg} border ${stage.borderColor}`}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `hsl(${stage.colorVar.replace("--", "")})` + "20" }}
                  >
                    <Icon
                      name={stage.iconName}
                      size={13}
                      style={{ color: `hsl(var(${stage.colorVar}))` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stage.label}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${stage.badgeClass}`}
                  >
                    {stage.deals.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {formatAmount(total)}
                </div>
              </div>

              {/* Deal cards */}
              <div className="flex flex-col gap-2">
                {stage.deals.map((deal, dealIdx) => {
                  const gradIdx = (stageIdx + dealIdx) % avatarGradients.length;
                  return (
                    <div key={deal.id} className="deal-card group flex flex-col gap-3">
                      {/* Top row: avatar + company + priority */}
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradients[gradIdx]} flex items-center justify-center shrink-0 text-xs font-bold ${avatarTextColors[gradIdx]}`}
                        >
                          {initials(deal.company)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-blue-600 transition-colors">
                            {deal.company}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {deal.person}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${priorityBadge[deal.priority]}`}
                        >
                          <span className="flex items-center gap-0.5">
                            <Icon name={priorityIcon[deal.priority]} size={9} />
                            {deal.priority}
                          </span>
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-foreground tracking-tight">
                          {formatAmount(deal.amount)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Clock" size={11} />
                          <span>
                            {deal.daysInStage}{" "}
                            {deal.daysInStage === 1
                              ? "день"
                              : deal.daysInStage < 5
                              ? "дня"
                              : "дней"}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar for days (visual cue: >10 days = warning) */}
                      <div className="progress-bar">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (deal.daysInStage / 20) * 100)}%`,
                            background:
                              deal.daysInStage >= 14
                                ? "hsl(var(--crm-rose))"
                                : deal.daysInStage >= 7
                                ? "hsl(var(--crm-amber))"
                                : `hsl(var(${stage.colorVar}))`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add deal button */}
              <button
                className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium text-muted-foreground border border-dashed border-border hover:border-border/80 hover:bg-white/80 transition-all duration-200"
              >
                <Icon name="Plus" size={13} />
                Добавить сделку
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
