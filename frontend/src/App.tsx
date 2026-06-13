import { useState } from 'react';
import { useCRM } from './context/CRMContext';
import Toast from './components/Toast';
import StatsBar from './components/StatsBar';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';

type Tab = 'dashboard' | 'customers' | 'orders';

const tabs: { key: Tab; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'customers', label: 'Pelanggan' },
  { key: 'orders', label: 'Pesanan' },
];

function App() {
  const { toast } = useCRM();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M3 9h18" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">Mini CRM</h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mt-1">UMKM Kuliner</p>
          </div>
        </div>

        <nav className="flex gap-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                tab === key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'dashboard' && (
          <>
            <StatsBar />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomerList
                selectedId={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
              />
              <OrderList selectedCustomerId={selectedCustomer} />
            </div>
            {selectedCustomer && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Menampilkan riwayat pesanan pelanggan terpilih. Klik kembali nama pelanggan untuk melihat seluruh pesanan.
              </p>
            )}
          </>
        )}

        {tab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomerForm />
            <CustomerList interactive={false} />
          </div>
        )}

        {tab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OrderForm />
            <OrderList selectedCustomerId={null} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
