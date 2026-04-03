import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { dealsApi } from "@/lib/api";

type DealStage = "Новая" | "Квалификация" | "Предложение" | "Переговоры" | "Закрытие";

interface DealModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface DealFormData {
  name: string;
  client_name: string;
  stage: DealStage;
  amount: string;
  probability: number;
  manager: string;
  close_date: string;
  notes: string;
}

const STAGES: DealStage[] = ["Новая", "Квалификация", "Предложение", "Переговоры", "Закрытие"];

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all";

const LABEL_CLASS = "block text-xs font-medium text-muted-foreground mb-1";

const INITIAL_FORM: DealFormData = {
  name: "",
  client_name: "",
  stage: "Новая",
  amount: "",
  probability: 50,
  manager: "",
  close_date: "",
  notes: "",
};

export default function DealModal({ open, onClose, onSaved }: DealModalProps) {
  const [form, setForm] = useState<DealFormData>(INITIAL_FORM);
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

  function set<K extends keyof DealFormData>(key: K, value: DealFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Введите название сделки"); return; }

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        stage: form.stage,
        probability: form.probability,
      };
      if (form.client_name.trim()) payload.client_name = form.client_name.trim();
      if (form.amount.trim()) {
        const parsed = parseFloat(form.amount.replace(/\s/g, "").replace(",", "."));
        if (!isNaN(parsed)) payload.amount = parsed;
      }
      if (form.manager.trim()) payload.manager = form.manager.trim();
      if (form.close_date) payload.close_date = form.close_date;
      if (form.notes.trim()) payload.notes = form.notes.trim();

      const res = await dealsApi.create(payload);

      if (res && (res.error || res.detail)) {
        setError(res.error || res.detail || "Ошибка при создании сделки");
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Не удалось создать сделку. Попробуйте ещё раз.");
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
              <Icon name="Briefcase" size={16} style={{ color: "hsl(var(--crm-blue))" }} />
            </div>
            <h2 className="text-base font-semibold text-foreground">Новая сделка</h2>
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
            {/* Row: name / client */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>
                  Название сделки <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="Лицензия на ПО"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Клиент / компания</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="ООО «Название»"
                  value={form.client_name}
                  onChange={(e) => set("client_name", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row: stage / amount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Этап</label>
                <select
                  className={INPUT_CLASS}
                  value={form.stage}
                  onChange={(e) => set("stage", e.target.value as DealStage)}
                  disabled={loading}
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>Сумма, ₽</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={INPUT_CLASS}
                  placeholder="500 000"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Probability slider */}
            <div>
              <label className={LABEL_CLASS}>
                Вероятность, %
                <span className="ml-2 font-semibold" style={{ color: "hsl(var(--crm-blue))" }}>
                  {form.probability}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.probability}
                onChange={(e) => set("probability", Number(e.target.value))}
                disabled={loading}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-muted"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Row: manager / close_date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Менеджер</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="Иван Иванов"
                  value={form.manager}
                  onChange={(e) => set("manager", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Дата закрытия</label>
                <input
                  type="date"
                  className={INPUT_CLASS}
                  value={form.close_date}
                  onChange={(e) => set("close_date", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={LABEL_CLASS}>Заметки</label>
              <textarea
                className={INPUT_CLASS + " resize-none"}
                rows={3}
                placeholder="Дополнительная информация о сделке..."
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
                  <Icon name="Briefcase" size={14} />
                  Создать сделку
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
