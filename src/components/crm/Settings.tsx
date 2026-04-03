import { useState } from "react";
import Icon from "@/components/ui/icon";

type SettingsTab = "Пользователи" | "Роли" | "Параметры" | "Уведомления";
type UserStatus = "Активен" | "Неактивен" | "Приглашён";
type UserRole = "Администратор" | "Руководитель" | "Менеджер";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  initials: string;
  avatarGrad: string;
  avatarText: string;
}

interface RolePermission {
  label: string;
  admin: boolean;
  lead: boolean;
  manager: boolean;
}

interface DealStage {
  id: number;
  name: string;
  color: string;
}

interface NotifEvent {
  id: number;
  label: string;
  sub: string;
  email: boolean;
  telegram: boolean;
  push: boolean;
}

const settingsTabs: SettingsTab[] = ["Пользователи", "Роли", "Параметры", "Уведомления"];

const users: User[] = [
  {
    id: 1,
    name: "Дмитрий Лебедев",
    email: "lebedev@company.ru",
    role: "Администратор",
    status: "Активен",
    lastLogin: "03 апр 2026, 09:14",
    initials: "ДЛ",
    avatarGrad: "from-violet-100 to-violet-200",
    avatarText: "text-violet-700",
  },
  {
    id: 2,
    name: "Анна Петрова",
    email: "petrova@company.ru",
    role: "Руководитель",
    status: "Активен",
    lastLogin: "03 апр 2026, 08:47",
    initials: "АП",
    avatarGrad: "from-green-100 to-green-200",
    avatarText: "text-green-700",
  },
  {
    id: 3,
    name: "Алексей Воронов",
    email: "voronov@company.ru",
    role: "Менеджер",
    status: "Активен",
    lastLogin: "02 апр 2026, 18:32",
    initials: "АВ",
    avatarGrad: "from-blue-100 to-blue-200",
    avatarText: "text-blue-700",
  },
  {
    id: 4,
    name: "Мария Соколова",
    email: "sokolova@company.ru",
    role: "Менеджер",
    status: "Активен",
    lastLogin: "03 апр 2026, 10:05",
    initials: "МС",
    avatarGrad: "from-rose-100 to-rose-200",
    avatarText: "text-rose-700",
  },
  {
    id: 5,
    name: "Виктор Зайцев",
    email: "zaitsev@company.ru",
    role: "Менеджер",
    status: "Неактивен",
    lastLogin: "28 мар 2026, 14:20",
    initials: "ВЗ",
    avatarGrad: "from-amber-100 to-amber-200",
    avatarText: "text-amber-700",
  },
  {
    id: 6,
    name: "Светлана Власова",
    email: "vlasova@company.ru",
    role: "Менеджер",
    status: "Приглашён",
    lastLogin: "—",
    initials: "СВ",
    avatarGrad: "from-teal-100 to-teal-200",
    avatarText: "text-teal-700",
  },
];

const rolePermissions: RolePermission[] = [
  { label: "Просмотр всех сделок", admin: true, lead: true, manager: false },
  { label: "Редактирование сделок", admin: true, lead: true, manager: true },
  { label: "Удаление сделок", admin: true, lead: false, manager: false },
  { label: "Управление клиентами", admin: true, lead: true, manager: true },
  { label: "Удаление клиентов", admin: true, lead: false, manager: false },
  { label: "Доступ к аналитике", admin: true, lead: true, manager: false },
  { label: "Управление интеграциями", admin: true, lead: false, manager: false },
  { label: "Управление пользователями", admin: true, lead: false, manager: false },
  { label: "Редактирование настроек", admin: true, lead: false, manager: false },
  { label: "Экспорт данных", admin: true, lead: true, manager: false },
];

const roleBadge: Record<UserRole, string> = {
  Администратор: "badge-rose",
  Руководитель: "badge-violet",
  Менеджер: "badge-blue",
};

const statusBadge: Record<UserStatus, string> = {
  Активен: "badge-green",
  Неактивен: "badge-rose",
  Приглашён: "badge-amber",
};

const initialStages: DealStage[] = [
  { id: 1, name: "Новые", color: "hsl(var(--crm-blue))" },
  { id: 2, name: "Квалификация", color: "hsl(var(--crm-violet))" },
  { id: 3, name: "Предложение", color: "hsl(var(--crm-amber))" },
  { id: 4, name: "Переговоры", color: "hsl(var(--crm-rose))" },
  { id: 5, name: "Закрытие", color: "hsl(var(--crm-green))" },
];

const initialNotifs: NotifEvent[] = [
  { id: 1, label: "Новая сделка создана", sub: "При добавлении любой новой сделки", email: true, telegram: true, push: false },
  { id: 2, label: "Сделка выиграна", sub: "При переводе сделки в статус «Выиграна»", email: true, telegram: true, push: true },
  { id: 3, label: "Сделка проиграна", sub: "При переводе сделки в статус «Проиграна»", email: false, telegram: true, push: false },
  { id: 4, label: "Новый клиент", sub: "При добавлении нового клиента в базу", email: true, telegram: false, push: false },
  { id: 5, label: "Задача просрочена", sub: "Если задача не выполнена в срок", email: true, telegram: true, push: true },
  { id: 6, label: "Входящее письмо", sub: "При получении письма от клиента", email: false, telegram: false, push: true },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
        value ? "" : "bg-muted"
      }`}
      style={value ? { background: "hsl(var(--crm-blue))" } : {}}
    >
      <span
        className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 absolute top-[3px] ${
          value ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function Checkbox({ value }: { value: boolean }) {
  return (
    <div
      className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-colors ${
        value ? "border-transparent" : "border-border bg-white"
      }`}
      style={value ? { background: "hsl(var(--crm-blue))" } : {}}
    >
      {value && <Icon name="Check" size={10} className="text-white" />}
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Пользователи");
  const [stages, setStages] = useState<DealStage[]>(initialStages);
  const [notifs, setNotifs] = useState<NotifEvent[]>(initialNotifs);
  const [companyName, setCompanyName] = useState("ООО «Ваша Компания»");
  const [currency, setCurrency] = useState("RUB — Российский рубль (₽)");
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("18:00");

  function toggleNotif(id: number, field: "email" | "telegram" | "push") {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: !n[field] } : n))
    );
  }

  function removeStage(id: number) {
    setStages((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6 min-h-screen bg-background font-golos">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Настройки</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Управление системой и пользователями</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "hsl(var(--crm-blue))" }}
        >
          <Icon name="Save" size={15} />
          Сохранить изменения
        </button>
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-1.5 flex gap-1">
        {settingsTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeTab === tab ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted/50"
            }`}
            style={activeTab === tab ? { background: "hsl(var(--crm-blue))" } : {}}
          >
            <Icon
              name={
                tab === "Пользователи" ? "Users" :
                tab === "Роли" ? "ShieldCheck" :
                tab === "Параметры" ? "SlidersHorizontal" : "Bell"
              }
              size={15}
            />
            {tab}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {activeTab === "Пользователи" && (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon name="Users" size={15} className="text-blue-500" />
              </div>
              <span className="font-semibold text-sm text-foreground">Пользователи системы</span>
              <span className="badge-blue text-xs font-semibold px-2 py-0.5 rounded-full">{users.length}</span>
            </div>
            <button
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium text-white shadow-sm transition-all"
              style={{ background: "hsl(var(--crm-blue))" }}
            >
              <Icon name="UserPlus" size={14} />
              Пригласить
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                {["Пользователь", "Роль", "Статус", "Последний вход", "Действия"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`group hover:bg-muted/20 transition-colors ${idx !== users.length - 1 ? "border-b border-border/30" : ""}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-xs font-bold shrink-0 ${u.avatarGrad} ${u.avatarText}`}>
                        {u.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadge[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-muted-foreground">{u.lastLogin}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-blue-50 hover:text-blue-500 transition-colors">
                        <Icon name="Pencil" size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-amber-50 hover:text-amber-500 transition-colors">
                        <Icon name="KeyRound" size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <Icon name="UserX" size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ROLES TAB ── */}
      {activeTab === "Роли" && (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <Icon name="ShieldCheck" size={15} className="text-violet-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">Права доступа по ролям</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wide w-1/2">
                    Разрешение
                  </th>
                  {(["Администратор", "Руководитель", "Менеджер"] as UserRole[]).map((role) => (
                    <th key={role} className="text-center text-xs font-semibold px-4 py-3 uppercase tracking-wide">
                      <span className={`px-2.5 py-1 rounded-full ${roleBadge[role]}`}>{role}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rolePermissions.map((perm, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-muted/20 transition-colors ${idx !== rolePermissions.length - 1 ? "border-b border-border/30" : ""}`}
                  >
                    <td className="px-5 py-3 text-sm text-foreground">{perm.label}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center"><Checkbox value={perm.admin} /></div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center"><Checkbox value={perm.lead} /></div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center"><Checkbox value={perm.manager} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PARAMETERS TAB ── */}
      {activeTab === "Параметры" && (
        <div className="flex flex-col gap-5">
          {/* Company info */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/40">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon name="Building2" size={15} className="text-blue-500" />
              </div>
              <span className="font-semibold text-sm text-foreground">Компания</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Название компании</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Валюта</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer"
                >
                  <option>RUB — Российский рубль (₽)</option>
                  <option>USD — Доллар США ($)</option>
                  <option>EUR — Евро (€)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Начало рабочего дня</label>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Конец рабочего дня</label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-sm text-foreground focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Deal stages */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Icon name="Layers" size={15} className="text-amber-500" />
                </div>
                <span className="font-semibold text-sm text-foreground">Этапы воронки продаж</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl badge-blue hover:opacity-80 transition-opacity">
                <Icon name="Plus" size={12} />
                Добавить этап
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 hover:bg-muted/20 transition-colors group">
                  <Icon name="GripVertical" size={15} className="text-muted-foreground/40 cursor-grab" />
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: stage.color }} />
                  <span className="flex-1 text-sm font-medium text-foreground">{stage.name}</span>
                  <span className="text-xs text-muted-foreground">Этап {idx + 1}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-amber-50 hover:text-amber-500 transition-colors">
                      <Icon name="Pencil" size={12} />
                    </button>
                    <button
                      onClick={() => removeStage(stage.id)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    >
                      <Icon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === "Уведомления" && (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Icon name="Bell" size={15} className="text-amber-500" />
            </div>
            <span className="font-semibold text-sm text-foreground">Настройки уведомлений</span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_80px_96px_72px] gap-4 px-5 py-3 border-b border-border/30 bg-muted/10">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Событие</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Email</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Telegram</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Push</span>
          </div>

          <div className="flex flex-col divide-y divide-border/30">
            {notifs.map((notif) => (
              <div key={notif.id} className="grid grid-cols-[1fr_80px_96px_72px] gap-4 px-5 py-4 items-center hover:bg-muted/10 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{notif.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.sub}</p>
                </div>
                <div className="flex justify-center">
                  <Toggle value={notif.email} onChange={(v) => toggleNotif(notif.id, "email")} />
                </div>
                <div className="flex justify-center">
                  <Toggle value={notif.telegram} onChange={(v) => toggleNotif(notif.id, "telegram")} />
                </div>
                <div className="flex justify-center">
                  <Toggle value={notif.push} onChange={(v) => toggleNotif(notif.id, "push")} />
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-border/40 bg-muted/10">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Icon name="Info" size={12} />
              Изменения вступают в силу немедленно после сохранения
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
