import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(AuthTokenGuard)
  async createCheckoutSession(@Body() paymentData: any) {
    return this.stripeService.createCheckoutSession(paymentData);
  }
}
