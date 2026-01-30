import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';

export async function webhook(req: Request, res: Response) {
  // Mercado Pago webhook placeholder
  // In production: verify signature with MERCADOPAGO_WEBHOOK_SECRET
  const { type, data } = req.body;

  try {
    if (type === 'payment' && data?.id) {
      // Store raw webhook
      await pool.query(
        `INSERT INTO payments (external_id, status, raw_webhook)
         VALUES ($1, 'received', $2)`,
        [String(data.id), JSON.stringify(req.body)]
      );

      // In production: fetch payment details from Mercado Pago API,
      // match to user by email, update access status
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
}

// Simulate payment for prototype
export async function simulatePayment(req: Request & { user?: any }, res: Response) {
  const { amount, currency } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const paymentId = 'MP-' + Date.now().toString(36).toUpperCase();

    await pool.query(
      `INSERT INTO payments (user_id, external_id, status, amount, currency)
       VALUES ($1, $2, 'completed', $3, $4)`,
      [userId, paymentId, amount || 29900, currency || 'COP']
    );

    await pool.query(
      `UPDATE users SET payment_id = $1 WHERE id = $2`,
      [paymentId, userId]
    );

    await pool.query(
      `INSERT INTO access_logs (user_id, user_email, event_type, event_detail)
       VALUES ($1, $2, 'payment_event', $3)`,
      [userId, req.user.email, `Pago simulado ${paymentId}`]
    );

    res.json({ payment_id: paymentId, status: 'completed' });
  } catch (err: any) {
    console.error('SimulatePayment error:', err);
    res.status(500).json({ error: 'Error al simular pago' });
  }
}
