import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '../utils/db';
import { Customer } from '../types';

export function getCustomers(_req: Request, res: Response): void {
  const db = readDb();
  res.json({ success: true, data: db.customers });
}

export function createCustomer(req: Request, res: Response, next: NextFunction): void {
  try {
    const { name, email, phone } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ success: false, message: 'Nama wajib diisi' });
      return;
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      res.status(400).json({ success: false, message: 'Email wajib diisi' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, message: 'Format email tidak valid' });
      return;
    }
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      res.status(400).json({ success: false, message: 'Nomor telepon wajib diisi' });
      return;
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
      res.status(400).json({ success: false, message: 'Nomor telepon tidak valid (harus 7–15 digit)' });
      return;
    }

    const db = readDb();

    const emailExists = db.customers.some(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      res.status(409).json({ success: false, message: 'Email ini sudah terdaftar' });
      return;
    }

    const newCustomer: Customer = {
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    db.customers.push(newCustomer);
    writeDb(db);

    res.status(201).json({ success: true, data: newCustomer });
  } catch (err) {
    next(err);
  }
}
