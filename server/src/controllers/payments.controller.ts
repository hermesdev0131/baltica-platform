import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { pool } from '../config/db';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create MercadoPago Checkout Pro preference
export async function createPreference(req: Request & { user?: any }, res: Response) {
  const userId = req.user?.userId;
  const userEmail = req.user?.email;

  if (!userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'baltica-programa-3dias',
            title: 'Báltica - Programa 3 días',
            quantity: 1,
            unit_price: 22900,
            currency_id: 'COP',
          },
        ],
        payer: {
          email: userEmail,
        },
        back_urls: {
          success: `${FRONTEND_URL}/payment?status=approved`,
          failure: `${FRONTEND_URL}/payment?status=failed`,
          pending: `${FRONTEND_URL}/payment?status=pending`,
        },
        auto_return: 'approved',
        external_reference: String(userId),
        notification_url: undefined, // Set in production
      },
    });

    res.json({ init_point: result.init_point });
  } catch (err: any) {
    console.error('CreatePreference error:', err);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
}

// Verify payment status with MercadoPago
export async function verifyPayment(req: Request & { user?: any }, res: Response) {
  const { paymentId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const payment = new Payment(mpClient);
    const result = await payment.get({ id: paymentId });

    if (result.status === 'approved') {
      // Activate user
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days (2 months)

      await pool.query(
        `UPDATE users SET status = 'active', payment_id = $1, access_expires_at = $2 WHERE id = $3`,
        [String(result.id), expiresAt.toISOString(), userId]
      );

      // Record payment
      await pool.query(
        `INSERT INTO payments (user_id, external_id, status, amount, currency, provider)
         VALUES ($1, $2, 'completed', $3, $4, 'mercadopago')
         ON CONFLICT (external_id) DO NOTHING`,
        [userId, String(result.id), result.transaction_amount, result.currency_id]
      );

      // Log event
      await pool.query(
        `INSERT INTO access_logs (user_id, user_email, event_type, event_detail)
         VALUES ($1, $2, 'payment_event', $3)`,
        [userId, req.user.email, `MercadoPago payment ${result.id} approved`]
      );
    }

    res.json({ status: result.status, payment_id: String(result.id) });
  } catch (err: any) {
    console.error('VerifyPayment error:', err);
    res.status(500).json({ error: 'Error al verificar pago' });
  }
}

// MercadoPago webhook
export async function webhook(req: Request, res: Response) {
  const { type, data } = req.body;

  try {
    if (type === 'payment' && data?.id) {
      // Store raw webhook
      await pool.query(
        `INSERT INTO payments (external_id, status, raw_webhook)
         VALUES ($1, 'received', $2)
         ON CONFLICT (external_id) DO UPDATE SET raw_webhook = $2`,
        [String(data.id), JSON.stringify(req.body)]
      );

      // Fetch payment details from MP
      const payment = new Payment(mpClient);
      const result = await payment.get({ id: data.id });

      if (result.status === 'approved' && result.external_reference) {
        const userId = parseInt(result.external_reference, 10);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days (2 months)

        // Activate user
        await pool.query(
          `UPDATE users SET status = 'active', payment_id = $1, access_expires_at = $2 WHERE id = $3`,
          [String(result.id), expiresAt.toISOString(), userId]
        );

        // Update payment record
        await pool.query(
          `UPDATE payments SET status = 'completed', user_id = $1, amount = $2, currency = $3, provider = 'mercadopago'
           WHERE external_id = $4`,
          [userId, result.transaction_amount, result.currency_id, String(result.id)]
        );

        // Log
        const userResult = await pool.query(`SELECT email FROM users WHERE id = $1`, [userId]);
        const email = userResult.rows[0]?.email || '';
        await pool.query(
          `INSERT INTO access_logs (user_id, user_email, event_type, event_detail)
           VALUES ($1, $2, 'payment_event', $3)`,
          [userId, email, `Webhook: MercadoPago payment ${result.id} approved`]
        );
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
}

