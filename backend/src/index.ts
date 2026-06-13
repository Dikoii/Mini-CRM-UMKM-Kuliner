import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customers';
import orderRoutes from './routes/orders';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API aktif dan berjalan dengan baik' });
});

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Mini CRM API running on http://localhost:${PORT}`);
});

export default app;
