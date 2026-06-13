import { useCRM } from '../context/CRMContext';

interface Props {
  selectedCustomerId: string | null;
}

export default function OrderList({ selectedCustomerId }: Props) {
  const { orders, customers } = useCRM();

  const filtered = selectedCustomerId
    ? orders.filter((o) => o.customer_id === selectedCustomerId)
    : orders;

  const customerName = (id: string) =>
    customers.find((c) => c.id === id)?.name ?? 'Tidak diketahui';

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">
            {selectedCustomerId
              ? `Pesanan — ${customerName(selectedCustomerId)}`
              : 'Semua Pesanan'}
          </h2>
          {selectedCustomerId && (
            <p className="text-xs text-slate-400 mt-0.5">Klik nama pelanggan pada daftar untuk menampilkan pesanan</p>
          )}
        </div>
        <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
          {filtered.length}
        </span>
      </div>

      <div className="overflow-y-auto max-h-72 divide-y divide-slate-100">
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">Belum ada pesanan</p>
        )}
        {[...filtered].reverse().map((o) => (
          <div key={o.id} className="px-4 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <p className="text-sm font-semibold text-slate-900">{customerName(o.customer_id)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{fmt(o.createdAt)}</p>
              </div>
              <span className="text-sm font-bold text-brand-700 shrink-0">
                Rp {o.total_price.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {o.items.map((it, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-50 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded"
                >
                  {it.name} ×{it.quantity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
