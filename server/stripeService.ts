import { storage } from './storage';
import { getUncachableStripeClient } from './stripeClient';
import { db } from './db';
import { sql } from 'drizzle-orm';

export class StripeService {
  async createCustomer(email: string, userId: string) {
    const stripe = await getUncachableStripeClient();
    if (!stripe) throw new Error('Stripe not configured');
    return await stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  async createCheckoutSession(
    customerId: string, 
    priceId: string, 
    successUrl: string, 
    cancelUrl: string,
    mode: 'subscription' | 'payment' = 'subscription'
  ) {
    const stripe = await getUncachableStripeClient();
    if (!stripe) throw new Error('Stripe not configured');
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    if (!stripe) throw new Error('Stripe not configured');
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async syncProductsFromStripe(): Promise<{ products: number; prices: number }> {
    const stripe = await getUncachableStripeClient();
    if (!stripe) throw new Error('Stripe not configured');

    const account = await stripe.accounts.retrieve();
    const accountId = account.id;

    const accountRawData = JSON.stringify(account);
    await db.execute(sql`
      INSERT INTO stripe.accounts (_raw_data, _updated_at, _account_id)
      VALUES (${accountRawData}::jsonb, NOW(), ${accountId})
      ON CONFLICT (id) DO UPDATE SET
        _raw_data = EXCLUDED._raw_data,
        _updated_at = NOW()
    `);

    const products = await stripe.products.list({ active: true, limit: 100 });
    const prices = await stripe.prices.list({ active: true, limit: 100 });

    let productsCount = 0;
    let pricesCount = 0;

    for (const product of products.data) {
      const rawData = JSON.stringify(product);
      await db.execute(sql`
        INSERT INTO stripe.products (_raw_data, _updated_at, _account_id)
        VALUES (${rawData}::jsonb, NOW(), ${accountId})
        ON CONFLICT (id) DO UPDATE SET
          _raw_data = EXCLUDED._raw_data,
          _updated_at = NOW()
      `);
      productsCount++;
    }

    for (const price of prices.data) {
      const rawData = JSON.stringify(price);
      await db.execute(sql`
        INSERT INTO stripe.prices (_raw_data, _updated_at, _account_id)
        VALUES (${rawData}::jsonb, NOW(), ${accountId})
        ON CONFLICT (id) DO UPDATE SET
          _raw_data = EXCLUDED._raw_data,
          _updated_at = NOW()
      `);
      pricesCount++;
    }

    return { products: productsCount, prices: pricesCount };
  }

  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`
    );
    return result.rows[0] || null;
  }

  async listProducts(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE active = ${active} LIMIT ${limit} OFFSET ${offset}`
    );
    return result.rows;
  }

  async listProductsWithPrices(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`
        WITH paginated_products AS (
          SELECT id, name, description, metadata, active
          FROM stripe.products
          WHERE active = ${active}
          ORDER BY id
          LIMIT ${limit} OFFSET ${offset}
        )
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active,
          pr.metadata as price_metadata
        FROM paginated_products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        ORDER BY p.id, pr.unit_amount
      `
    );
    return result.rows;
  }

  async getPrice(priceId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE id = ${priceId}`
    );
    return result.rows[0] || null;
  }

  async listPrices(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE active = ${active} LIMIT ${limit} OFFSET ${offset}`
    );
    return result.rows;
  }

  async getPricesForProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE product = ${productId} AND active = true`
    );
    return result.rows;
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    );
    return result.rows[0] || null;
  }
}

export const stripeService = new StripeService();
