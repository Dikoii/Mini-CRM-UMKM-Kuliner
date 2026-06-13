import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Field, Input } from './FormFields';

interface ItemRow {
  name: string;
  quantity: number;
  price: number;
}

interface FormErrors {
  customer?: string;
  items?: string;
}

export default function OrderForm() {
  const { customers, addOrder, loading } = useCRM();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<ItemRow[]>([{ name: '', quantity: 1, price: 0 }]);
  const [errors, setErrors] = useState<FormErrors>({});

  const totalPrice = items.reduce(
    (sum, it) => sum + Number(it.quantity) * Number(it.price),
    0
  );

  const addItem = () => setItems((p) => [...p, { name: '', quantity: 1, price: 0 }]);

  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: keyof ItemRow, val: string | number) =>
    setItems((p) => p.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!customerId) e.customer = 'Pilih pelanggan terlebih dahulu';
    const badItem = items.find(
      (it) => !it.name.trim() || Number(it.quantity) < 1 || Number(it.price) < 0
    );
    if (badItem) e.items = 'Lengkapi semua item pesanan';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const result = await addOrder({
      customer_id: customerId,
      items: items.map((it) => ({
        name: it.name,
        quantity: Number(it.quantity),
        price: Number(it.price),
      })),
      total_price: totalPrice,
    });
    if (result.success) {
      setCustomerId('');
      setItems([{ name: '', quantity: 1, price: 0 }]);
      setErrors({});
    } else if (result.message) {
      const msg = result.message;
      const newErrors: FormErrors = {};
      if (msg.toLowerCase().includes('pelanggan') || msg.toLowerCase().includes('customer')) {
        newErrors.customer = msg;
      } else if (msg.toLowerCase().includes('item') || msg.toLowerCase().includes('menu') || msg.toLowerCase().includes('harga') || msg.toLowerCase().includes('qty')) {
        newErrors.items = msg;
      }
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="border-l-4 border-brand-600 pl-3 mb-5">
        <h2 className="font-bold text-slate-900 text-base">Tambah Pesanan</h2>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Pelanggan" error={errors.customer}>
          <select
            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 block w-full p-2.5 transition-all duration-150"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Pilih pelanggan</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </Field>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Item Pesanan
          </label>
          {errors.items && <p className="text-xs text-red-600 font-medium mb-2">{errors.items}</p>}
          
          <div className="flex gap-2 mb-1.5 text-xs font-bold text-slate-400 select-none px-1">
            <span className="flex-1">Nama Menu</span>
            <span className="w-16 text-center">Qty</span>
            <span className="w-28 text-left pl-1">Harga (Rp)</span>
            {items.length > 1 && <span className="w-8"></span>}
          </div>

          <div className="flex flex-col gap-2">
            {items.map((it, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  className="flex-1"
                  placeholder="Nama menu"
                  value={it.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={it.quantity}
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 p-2.5 w-16 text-center transition-all duration-150"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Harga"
                  value={it.price}
                  onChange={(e) => updateItem(i, 'price', e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 p-2.5 w-28 transition-all duration-150"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(i)}
                    className="text-slate-400 hover:text-red-600 p-1.5 transition-colors shrink-0"
                    aria-label="Hapus item"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold mt-2 inline-flex items-center gap-1 cursor-pointer"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah item
          </button>
        </div>

        <div className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total</span>
          <span className="text-base font-bold text-slate-900">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg py-2.5 px-4 shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer text-center"
        >
          {loading ? 'Menyimpan...' : 'Simpan Pesanan'}
        </button>
      </div>
    </div>
  );
}
