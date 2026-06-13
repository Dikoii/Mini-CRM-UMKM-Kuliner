import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Field, Input } from './FormFields';

interface FormState {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function CustomerForm() {
  const { addCustomer, loading } = useCRM();
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    
    if (!form.email.trim()) {
      e.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Format email tidak valid';
    }
    
    if (!form.phone.trim()) {
      e.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) {
      e.phone = 'Nomor telepon tidak valid (harus 7–15 digit)';
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const result = await addCustomer(form);
    if (result.success) {
      setForm({ name: '', email: '', phone: '' });
      setErrors({});
    } else if (result.message) {
      const msg = result.message;
      const newErrors: FormErrors = {};
      if (msg.toLowerCase().includes('nama')) {
        newErrors.name = msg;
      } else if (msg.toLowerCase().includes('email')) {
        newErrors.email = msg;
      } else if (msg.toLowerCase().includes('telepon') || msg.toLowerCase().includes('phone') || msg.toLowerCase().includes('nomor')) {
        newErrors.phone = msg;
      }
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="border-l-4 border-brand-600 pl-3 mb-5">
        <h2 className="font-bold text-slate-900 text-base">Tambah Pelanggan</h2>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Nama Lengkap" error={errors.name}>
          <Input
            placeholder="cth. Budi Santoso"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            placeholder="budi@email.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </Field>

        <Field label="Nomor Telepon" error={errors.phone}>
          <Input
            placeholder="08123456789"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </Field>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg py-2.5 px-4 shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer text-center"
        >
          {loading ? 'Menyimpan...' : 'Simpan Pelanggan'}
        </button>
      </div>
    </div>
  );
}
