import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(data: {
    id: string | number;
    name: string;
    price: number;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: data.name,
            },
            unit_amount: Math.round(data.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_URL')}/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/orders?canceled=true`,
    });

    return {
      sessionUrl: session.url,
      sessionId: session.id,
    };
  }

  async verifyPaymentSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    return {
      status: session.payment_status === 'paid' ? 'complete' : session.status,
      customer: session.customer,
      amount: session.amount_total,
      currency: session.currency,
    };
  }
}
