import fs from 'fs';
import path from 'path';
import { Database } from '../types';

const DB_PATH = path.join(__dirname, '../../db.json');

const defaultDb: Database = {
  customers: [],
  orders: [],
};

export function readDb(): Database {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDb(defaultDb);
      return defaultDb;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as Database;
  } catch {
    return defaultDb;
  }
}

export function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
