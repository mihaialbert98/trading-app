'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import Widget from '@/components/Widget';
import type {
  CustomRule,
  CustomCondition,
  CustomIndicatorSource,
  CustomConditionOperator,
  CustomSignalOutputType,
  CustomRhsType,
} from '@/types/customSignals';

// ─── Label maps ────────────────────────────────────────────────────────────────

const INDICATOR_LABELS: Record<CustomIndicatorSource, string> = {
  RSI: 'RSI(14)',
  MACD_LINE: 'Linie MACD',
  MACD_SIGNAL: 'Semnal MACD',
  MACD_HISTOGRAM: 'Histogramă MACD',
  PRICE: 'Preț',
  BOLLINGER_UPPER: 'Bollinger Superior',
  BOLLINGER_MIDDLE: 'Bollinger Mijlociu',
  BOLLINGER_LOWER: 'Bollinger Inferior',
  EMA_9: 'EMA(9)',
  EMA_21: 'EMA(21)',
  EMA_50: 'EMA(50)',
  EMA_200: 'EMA(200)',
  SMA_50: 'SMA(50)',
  SMA_200: 'SMA(200)',
  VOLUME: 'Volum',
};

const OPERATOR_LABELS: Record<CustomConditionOperator, string> = {
  CROSSES_ABOVE: 'trece peste',
  CROSSES_BELOW: 'trece sub',
  IS_ABOVE: 'este peste',
  IS_BELOW: 'este sub',
};

const OUTPUT_LABELS: Record<CustomSignalOutputType, string> = {
  BUY: 'Cumpărare',
  SELL: 'Vânzare',
  WARNING: 'Avertisment',
};

const OUTPUT_COLORS: Record<CustomSignalOutputType, string> = {
  BUY: 'text-gain',
  SELL: 'text-loss',
  WARNING: 'text-yellow-400',
};

const ALL_SOURCES = Object.keys(INDICATOR_LABELS) as CustomIndicatorSource[];

// ─── Empty condition factory ────────────────────────────────────────────────

function emptyCondition(): CustomCondition {
  return {
    lhs: 'RSI',
    operator: 'CROSSES_ABOVE',
    rhsType: 'VALUE',
    rhsValue: 30,
  };
}

// ─── ConditionRow ───────────────────────────────────────────────────────────

const SELECT_CLS = 'w-full bg-navy border border-border-subtle rounded px-2 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent';

function ConditionRow({
  condition,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  condition: CustomCondition;
  index: number;
  onChange: (c: CustomCondition) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="py-2 space-y-2">
      {/* AND label */}
      {index > 0 && (
        <span className="inline-block text-[10px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">ȘI</span>
      )}

      {/* Row 1: LHS + operator */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={condition.lhs}
          onChange={(e) => onChange({ ...condition, lhs: e.target.value as CustomIndicatorSource })}
          className={SELECT_CLS}
        >
          {ALL_SOURCES.map((s) => (
            <option key={s} value={s}>{INDICATOR_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={condition.operator}
          onChange={(e) => onChange({ ...condition, operator: e.target.value as CustomConditionOperator })}
          className={SELECT_CLS}
        >
          {(Object.keys(OPERATOR_LABELS) as CustomConditionOperator[]).map((op) => (
            <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>
          ))}
        </select>
      </div>

      {/* Row 2: RHS type toggle + value/indicator + remove */}
      <div className="flex items-center gap-2">
        {/* RHS type toggle */}
        <div className="flex rounded border border-border-subtle overflow-hidden shrink-0">
          {(['VALUE', 'INDICATOR'] as CustomRhsType[]).map((t) => (
            <button
              key={t}
              onClick={() => onChange({
                ...condition,
                rhsType: t,
                rhsValue: t === 'VALUE' ? 30 : undefined,
                rhsIndicator: t === 'INDICATOR' ? 'MACD_SIGNAL' : undefined,
              })}
              className={`px-2 py-1 text-[11px] font-mono transition-colors ${
                condition.rhsType === t
                  ? 'bg-accent text-white'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t === 'VALUE' ? 'Val.' : 'Ind.'}
            </button>
          ))}
        </div>

        {/* RHS value or indicator */}
        <div className="flex-1 min-w-0">
          {condition.rhsType === 'VALUE' ? (
            <input
              type="number"
              value={condition.rhsValue ?? ''}
              onChange={(e) => onChange({ ...condition, rhsValue: parseFloat(e.target.value) || 0 })}
              className="w-full bg-navy border border-border-subtle rounded px-2 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
            />
          ) : (
            <select
              value={condition.rhsIndicator ?? 'MACD_SIGNAL'}
              onChange={(e) => onChange({ ...condition, rhsIndicator: e.target.value as CustomIndicatorSource })}
              className={SELECT_CLS}
            >
              {ALL_SOURCES.map((s) => (
                <option key={s} value={s}>{INDICATOR_LABELS[s]}</option>
              ))}
            </select>
          )}
        </div>

        {canRemove && (
          <button
            onClick={onRemove}
            className="shrink-0 p-1 text-text-dim hover:text-loss transition-colors rounded"
            title="Șterge condiție"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── RuleForm ────────────────────────────────────────────────────────────────

function RuleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CustomRule;
  onSave: (rule: CustomRule) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [outputType, setOutputType] = useState<CustomSignalOutputType>(initial?.outputType ?? 'BUY');
  const [conditions, setConditions] = useState<CustomCondition[]>(
    initial?.conditions?.length ? initial.conditions : [emptyCondition()]
  );
  const [error, setError] = useState('');

  function updateCondition(idx: number, c: CustomCondition) {
    setConditions(conditions.map((x, i) => (i === idx ? c : x)));
  }

  function removeCondition(idx: number) {
    setConditions(conditions.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!name.trim()) { setError('Introdu un nume pentru semnal.'); return; }
    if (conditions.length === 0) { setError('Adaugă cel puțin o condiție.'); return; }
    for (const c of conditions) {
      if (c.rhsType === 'VALUE' && (c.rhsValue === undefined || isNaN(c.rhsValue))) {
        setError('Completează toate valorile numerice.'); return;
      }
    }
    setError('');
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(),
      outputType,
      conditions,
      enabled: initial?.enabled ?? true,
    });
  }

  return (
    <div className="space-y-3">
      {/* Name */}
      <input
        type="text"
        placeholder="Numele semnalului…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-navy border border-border-subtle rounded px-3 py-1.5 text-sm font-sans text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent"
      />

      {/* Type selector — full width, three equal buttons */}
      <div className="flex rounded border border-border-subtle overflow-hidden">
        {(Object.keys(OUTPUT_LABELS) as CustomSignalOutputType[]).map((t) => (
          <button
            key={t}
            onClick={() => setOutputType(t)}
            className={`flex-1 py-1.5 text-xs font-mono transition-colors ${
              outputType === t
                ? `bg-panel-hover ${OUTPUT_COLORS[t]} font-semibold`
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {OUTPUT_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Conditions */}
      <div className="border border-border-subtle rounded divide-y divide-border-subtle px-3">
        {conditions.map((c, i) => (
          <ConditionRow
            key={i}
            condition={c}
            index={i}
            onChange={(updated) => updateCondition(i, updated)}
            onRemove={() => removeCondition(i)}
            canRemove={conditions.length > 1}
          />
        ))}
        <button
          onClick={() => setConditions([...conditions, emptyCondition()])}
          className="w-full py-2 text-xs font-mono text-accent hover:text-accent/80 transition-colors text-center"
        >
          + Adaugă condiție (ȘI)
        </button>
      </div>

      {error && (
        <p className="text-xs text-loss font-sans">{error}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-sans text-text-muted border border-border-subtle rounded hover:text-text-primary transition-colors"
        >
          Anulează
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-xs font-sans bg-accent text-white rounded hover:bg-accent/80 transition-colors"
        >
          {initial ? 'Salvează' : 'Creează semnal'}
        </button>
      </div>
    </div>
  );
}

// ─── RuleRow ─────────────────────────────────────────────────────────────────

function RuleRow({
  rule,
  onEdit,
  onDelete,
  onToggle,
}: {
  rule: CustomRule;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-border-subtle last:border-0 transition-opacity ${rule.enabled ? '' : 'opacity-50'}`}>
      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ${rule.enabled ? 'bg-accent' : 'bg-border-subtle'}`}
        title={rule.enabled ? 'Dezactivează' : 'Activează'}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-semibold text-text-primary truncate">{rule.name}</span>
          <span className={`text-[10px] font-mono font-semibold shrink-0 ${OUTPUT_COLORS[rule.outputType]}`}>
            {OUTPUT_LABELS[rule.outputType]}
          </span>
        </div>
        <p className="text-[10px] font-mono text-text-dim truncate mt-0.5">
          {rule.conditions.map((c, i) => {
            const rhs = c.rhsType === 'VALUE'
              ? String(c.rhsValue)
              : INDICATOR_LABELS[c.rhsIndicator!];
            return `${i > 0 ? ' ȘI ' : ''}${INDICATOR_LABELS[c.lhs]} ${OPERATOR_LABELS[c.operator]} ${rhs}`;
          }).join('')}
        </p>
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 text-text-dim hover:text-accent transition-colors rounded"
          title="Editează"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-text-dim hover:text-loss transition-colors rounded"
          title="Șterge"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 3h8M5 3V2h2v1M4 3v7h4V3H4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CustomSignalBuilder() {
  const { customRules, addCustomRule, updateCustomRule, removeCustomRule, toggleCustomRule } = useStore();
  const [editingRule, setEditingRule] = useState<CustomRule | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleSave(rule: CustomRule) {
    if (editingRule) {
      updateCustomRule(rule);
    } else {
      addCustomRule(rule);
    }
    setShowForm(false);
    setEditingRule(null);
  }

  function handleEdit(rule: CustomRule) {
    setEditingRule(rule);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingRule(null);
  }

  const badge = customRules.length > 0
    ? `${customRules.filter((r) => r.enabled).length}/${customRules.length}`
    : undefined;

  return (
    <Widget id="custom-signals" title="Semnale Personalizate" badge={badge} tourAttr="custom-signals">
      {customRules.length > 0 && !showForm && (
        <div>
          {customRules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              onEdit={() => handleEdit(rule)}
              onDelete={() => removeCustomRule(rule.id)}
              onToggle={() => toggleCustomRule(rule.id)}
            />
          ))}
        </div>
      )}

      {showForm ? (
        <div className="p-4">
          <p className="text-xs font-sans text-text-muted mb-3">
            {editingRule ? 'Editează semnalul' : 'Semnal nou'}
          </p>
          <RuleForm
            initial={editingRule ?? undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <button
          onClick={() => { setEditingRule(null); setShowForm(true); }}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono text-accent hover:bg-panel-hover transition-colors border-t border-border-subtle"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Adaugă semnal nou
        </button>
      )}
    </Widget>
  );
}
