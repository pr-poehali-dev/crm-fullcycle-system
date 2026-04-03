import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { clientsApi } from "@/lib/api";

type Segment = "VIP" | "Активный" | "Потенциальный" | "Новый";
type Industry = "IT" | "Строительство" | "Медиа" | "Производство" | "Торговля" | "Финансы";

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface ClientFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  segment: Segment;
  industry: Industry | "";
  notes: string;
}

const SEGMENTS: Segment[] = ["VIP", "Активный", "Потенциальный", "Новый"];
const INDUSTRIES: Industry[] = ["IT", "Строительство", "Медиа", "Производство", "Торговля", "Финансы"];

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all";

const LABEL_CLASS = "block text-xs font-medium text-muted-foreground mb-1";

const INITIAL_FORM: ClientFormData = {
  name: "",
  company: "",
  phone: "",
  email: "",
  segment: "Новый",
  industry: "",
  notes: "",
};

export default function ClientModal({ open, onClose, onSaved }: ClientModalProps) {
  const [form, setForm] = useState<ClientFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL_FORM);
    setError(null);
    setLoading(false);
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function set<K extends keyof ClientFormData>(key: K, value: ClientFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Введите ФИО контакта"); return; }
    if (!form.company.trim()) { setError("Введите название компании"); return; }

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        company: form.company.trim(),
        segment: form.segment,
      };
      if (form.phone.trim()) payload.phone = form.phone.trim();
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.industry) payload.industry = form.industry;
      if (form.notes.trim()) payload.notes = form.notes.trim();

      const res = await clientsApi.create(payload);

      if (res && (res.error || res.detail)) {
        setError(res.error || res.detail || "Ошибка при создании клиента");
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Не удалось создать клиента. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-w-lg w-full rounded-2xl shadow-2xl bg-white p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--crm-blue-soft))" }}>
              <Icon name="UserPlus" size={16} style={{ color: "hsl(var(--crm-blue))" }} />
            </div>
            <h2 className="text-base font-semibold text-foreground">Новый клиент</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Row: name / company */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>
                  ФИО контакта <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  Компания <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="ООО «Название»"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row: phone / email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Телефон</label>
                <input
                  type="tel"
                  className={INPUT_CLASS}
                  placeholder="+7 (___) ___-__-__"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Email</label>
                <input
                  type="email"
                  className={INPUT_CLASS}
                  placeholder="mail@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row: segment / industry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Сегмент</label>
                <select
                  className={INPUT_CLASS}
                  value={form.segment}
                  onChange={(e) => set("segment", e.target.value as Segment)}
                  disabled={loading}
                >
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>Отрасль</label>
                <select
                  className={INPUT_CLASS}
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value as Industry | "")}
                  disabled={loading}
                >
                  <option value="">— не выбрана —</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={LABEL_CLASS}>Заметки</label>
              <textarea
                className={INPUT_CLASS + " resize-none"}
                rows={3}
                placeholder="Дополнительная информация о клиенте..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                <Icon name="AlertCircle" size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-70"
              style={{ background: "hsl(var(--crm-blue))" }}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={14} className="animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Icon name="UserPlus" size={14} />
                  Создать клиента
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
