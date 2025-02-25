import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() paymentData: any) {
    return this.stripeService.createCheckoutSession(paymentData);
  }

  @Get('verify-session/:sessionId')
  async verifySession(@Param('sessionId') sessionId: string) {
    return this.stripeService.verifyPaymentSession(sessionId);
  }
}
