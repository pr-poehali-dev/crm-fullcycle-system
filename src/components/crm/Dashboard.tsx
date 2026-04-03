import Icon from "@/components/ui/icon";

interface StatCard {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

interface Deal {
  id: number;
  client: string;
  amount: string;
  stage: string;
  stageBadge: string;
  manager: string;
  date: string;
}

interface Activity {
  id: number;
  type: "call" | "email" | "meeting" | "deal" | "task" | "note";
  text: string;
  sub: string;
  time: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    label: "Выручка",
    value: "₽2.4М",
    delta: "+12%",
    deltaPositive: true,
    iconName: "TrendingUp",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Сделки",
    value: "142",
    delta: "+8%",
    deltaPositive: true,
    iconName: "Briefcase",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Клиенты",
    value: "891",
    delta: "+24%",
    deltaPositive: true,
    iconName: "Users",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    label: "Конверсия",
    value: "34%",
    delta: "+3%",
    deltaPositive: true,
    iconName: "Target",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

const deals: Deal[] = [
  {
    id: 1,
    client: "ООО «Техноком»",
    amount: "₽480 000",
    stage: "Переговоры",
    stageBadge: "badge-amber",
    manager: "Алексей Воронов",
    date: "01 апр 2026",
  },
  {
    id: 2,
    client: "ИП Савельев А.Н.",
    amount: "₽125 000",
    stage: "Квалификация",
    stageBadge: "badge-blue",
    manager: "Мария Соколова",
    date: "31 мар 2026",
  },
  {
    id: 3,
    client: "АО «Прогресс Групп»",
    amount: "₽1 200 000",
    stage: "Выиграна",
    stageBadge: "badge-green",
    manager: "Дмитрий Лебедев",
    date: "30 мар 2026",
  },
  {
    id: 4,
    client: "ООО «СтройПроект»",
    amount: "₽340 000",
    stage: "Предложение",
    stageBadge: "badge-violet",
    manager: "Анна Петрова",
    date: "29 мар 2026",
  },
  {
    id: 5,
    client: "ЗАО «МедиаЛаб»",
    amount: "₽95 000",
    stage: "Проиграна",
    stageBadge: "badge-rose",
    manager: "Сергей Ильин",
    date: "28 мар 2026",
  },
];

const activities: Activity[] = [
  {
    id: 1,
    type: "call",
    text: "Звонок с ООО «Техноком»",
    sub: "Обсуждение условий договора",
    time: "10 мин назад",
    iconName: "Phone",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    id: 2,
    type: "deal",
    text: "Новая сделка создана",
    sub: "АО «Прогресс Групп» — ₽1.2М",
    time: "42 мин назад",
    iconName: "BadgePlus",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    type: "email",
    text: "Письмо отправлено",
    sub: "КП для ИП Савельев А.Н.",
    time: "1 ч назад",
    iconName: "Mail",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    id: 4,
    type: "meeting",
    text: "Встреча запланирована",
    sub: "ООО «СтройПроект», 5 апреля",
    time: "2 ч назад",
    iconName: "CalendarCheck",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    id: 5,
    type: "task",
    text: "Задача выполнена",
    sub: "Подготовить презентацию",
    time: "3 ч назад",
    iconName: "CheckCircle2",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  {
    id: 6,
    type: "note",
    text: "Заметка добавлена",
    sub: "ЗАО «МедиаЛаб» — причины отказа",
    time: "5 ч назад",
    iconName: "StickyNote",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Дашборд
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Сводка за апрель 2026
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "hsl(var(--crm-blue))" }}>
            <Icon name="Plus" size={15} />
            Новая сделка
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-white border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            style={{ color: "hsl(var(--crm-green))" }}>
            <Icon name="UserPlus" size={15} />
            Клиент
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-white border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            style={{ color: "hsl(var(--crm-amber))" }}>
            <Icon name="ClipboardList" size={15} />
            Задача
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="stat-card flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                <Icon name={s.iconName} size={20} className={s.iconColor} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.deltaPositive ? "badge-green" : "badge-rose"}`}>
                {s.delta}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Deals Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon name="Layers" size={15} className="text-blue-500" />
              </div>
              <span className="font-semibold text-foreground text-sm">Последние сделки</span>
            </div>
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg badge-blue transition-opacity hover:opacity-80">
              Все сделки
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wide">
                    Клиент
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">
                    Сумма
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">
                    Этап
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">
                    Менеджер
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, idx) => (
                  <tr
                    key={deal.id}
                    className={`group cursor-pointer transition-colors duration-150 hover:bg-muted/40 ${idx !== deals.length - 1 ? "border-b border-border/30" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-blue-600">
                            {deal.client.replace(/[«»ООО ИП АО ЗАО]/g, "").trim().charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                          {deal.client}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-foreground">
                      {deal.amount}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deal.stageBadge}`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {deal.manager}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">
                      {deal.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <Icon name="Activity" size={15} className="text-violet-500" />
              </div>
              <span className="font-semibold text-foreground text-sm">Активность</span>
            </div>
            <span className="text-xs badge-violet font-medium px-2.5 py-1 rounded-full">
              Сегодня
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border/30 overflow-y-auto">
            {activities.map((act, idx) => (
              <div
                key={act.id}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${act.iconBg}`}>
                  <Icon name={act.iconName} size={15} className={act.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug truncate">
                    {act.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {act.sub}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 mt-0.5 whitespace-nowrap">
                  {act.time}
                </span>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-border/40 mt-auto">
            <button className="w-full text-xs font-medium text-center py-2 rounded-xl badge-blue hover:opacity-80 transition-opacity">
              Посмотреть всё
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)",
          zIndex: 0,
        }}
      />
    </div>
  );
}
