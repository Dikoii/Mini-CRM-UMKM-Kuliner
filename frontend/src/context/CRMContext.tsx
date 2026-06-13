import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Customer, Order, ToastState } from '../types';

const API_BASE = '/'; // proxied by Vite to http://localhost:3001

interface CRMContextValue {
  customers: Customer[];
  orders: Order[];
  loading: boolean;
  toast: ToastState | null;
  addCustomer: (payload: { name: string; email: string; phone: string }) => Promise<{ success: boolean; message?: string }>;
  addOrder: (payload: { customer_id: string; items: { name: string; quantity: number; price: number }[]; total_price: number }) => Promise<{ success: boolean; message?: string }>;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (msg: string, type: ToastState['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}customers`);
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch {
      showToast('Gagal terhubung ke server', 'error');
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}orders`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch {}
  }, []);

  const addCustomer = async (payload: { name: string; email: string; phone: string }): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => [...prev, data.data]);
        showToast('Pelanggan berhasil ditambahkan!');
        return { success: true };
      } else {
        showToast(data.message || 'Gagal menambah pelanggan', 'error');
        return { success: false, message: data.message };
      }
    } catch {
      showToast('Gagal terhubung ke server', 'error');
      return { success: false, message: 'Gagal terhubung ke server' };
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (payload: {
    customer_id: string;
    items: { name: string; quantity: number; price: number }[];
    total_price: number;
  }): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => [...prev, data.data]);
        showToast('Pesanan berhasil ditambahkan!');
        return { success: true };
      } else {
        showToast(data.message || 'Gagal menambah pesanan', 'error');
        return { success: false, message: data.message };
      }
    } catch {
      showToast('Gagal terhubung ke server', 'error');
      return { success: false, message: 'Gagal terhubung ke server' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, [fetchCustomers, fetchOrders]);

  return (
    <CRMContext.Provider value={{ customers, orders, loading, toast, addCustomer, addOrder }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM(): CRMContextValue {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used inside CRMProvider');
  return ctx;
}
