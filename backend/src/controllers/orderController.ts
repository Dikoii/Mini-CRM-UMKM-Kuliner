import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '../utils/db';
import { Order, OrderItem } from '../types';

export function getOrders(req: Request, res: Response): void {
  const { customer_id } = req.query;
  const db = readDb();

  if (customer_id) {
    const customerExists = db.customers.some((c) => c.id === customer_id);
    if (!customerExists) {
      res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
      return;
    }
    const orders = db.orders.filter((o) => o.customer_id === customer_id);
    res.json({ success: true, data: orders });
    return;
  }

  res.json({ success: true, data: db.orders });
}

export function createOrder(req: Request, res: Response, next: NextFunction): void {
  try {
    const { customer_id, items, total_price } = req.body;

    if (!customer_id || typeof customer_id !== 'string') {
      res.status(400).json({ success: false, message: 'ID pelanggan wajib diisi' });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Daftar pesanan tidak boleh kosong' });
      return;
    }

    for (const item of items as OrderItem[]) {
      if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
        res.status(400).json({ success: false, message: 'Setiap item harus memiliki nama yang valid' });
        return;
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        res.status(400).json({ success: false, message: 'Jumlah item minimal 1' });
        return;
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        res.status(400).json({ success: false, message: 'Setiap item harus memiliki harga yang valid' });
        return;
      }
    }

    if (typeof total_price !== 'number' || total_price < 0) {
      res.status(400).json({ success: false, message: 'Total harga harus berupa angka valid' });
      return;
    }

    const db = readDb();

    const customerExists = db.customers.some((c) => c.id === customer_id);
    if (!customerExists) {
      res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
      return;
    }

    const newOrder: Order = {
      id: uuidv4(),
      customer_id,
      items,
      total_price,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    writeDb(db);

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    next(err);
  }
}
