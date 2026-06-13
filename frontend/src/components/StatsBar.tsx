import { useCRM } from '../context/CRMContext';

export default function StatsBar() {
  const { customers, orders } = useCRM();

  const revenue = orders.reduce((s, o) => s + o.total_price, 0);
  const loyalCount = customers.filter(
    (c) => orders.filter((o) => o.customer_id === c.id).length > 3
  ).length;

  const stats = [
    {
      label: 'Total Pelanggan',
      value: customers.length,
      icon: (
        <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: 'Total Pesanan',
      value: orders.length,
      icon: (
        <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00 2 2h10a2 2 0 00 2-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 00-2 2h2a2 2 0 00-2-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6-4h6" />
        </svg>
      ),
    },
    {
      label: 'Pelanggan Loyal',
      value: loyalCount,
      icon: (
        <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5c.176-.436.79-.436.966 0l2.36 5.82 6.333.682c.477.051.668.643.308.97l-4.78 4.332 1.34 6.273c.101.472-.415.847-.824.58l-5.46-3.565-5.46 3.565c-.41.267-.925-.108-.824-.58l1.34-6.273-4.78-4.332c-.36-.327-.17-.919.308-.97l6.333-.682 2.36-5.82z" />
        </svg>
      ),
    },
    {
      label: 'Total Pendapatan',
      value: `Rp ${(revenue / 1000).toFixed(0)}k`,
      icon: (
        <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200/80 px-4 py-4 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mb-3">
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</p>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
