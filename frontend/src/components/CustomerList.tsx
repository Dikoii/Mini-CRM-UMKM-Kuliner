import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Input } from './FormFields';

interface Props {
  selectedId?: string | null;
  onSelectCustomer?: (id: string | null) => void;
  interactive?: boolean;
}

export default function CustomerList({ selectedId, onSelectCustomer, interactive = true }: Props) {
  const { customers, orders } = useCRM();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const orderCount = (id: string) => orders.filter((o) => o.customer_id === id).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900 text-sm">Pelanggan</h2>
          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {customers.length}
          </span>
        </div>
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto max-h-72 divide-y divide-slate-100">
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">Belum ada pelanggan</p>
        )}
        {filtered.map((c) => {
          const cnt = orderCount(c.id);
          const isLoyal = cnt > 3;
          const isSelected = interactive && selectedId === c.id;

          const content = (
            <>
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {c.name}
                  </p>
                  {isLoyal && (
                    <span className="inline-flex items-center text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-semibold border border-brand-200">
                      Loyal
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{c.email}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded shrink-0">{cnt}x order</span>
            </>
          );

          if (interactive) {
            return (
              <button
                key={c.id}
                onClick={() => onSelectCustomer?.(c.id === selectedId ? null : c.id)}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer ${
                  isSelected ? 'bg-brand-50/70 border-l-4 border-brand-600 pl-3' : 'pl-4'
                }`}
              >
                {content}
              </button>
            );
          }

          return (
            <div
              key={c.id}
              className="px-4 py-3.5 flex items-center gap-3 pl-4"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
