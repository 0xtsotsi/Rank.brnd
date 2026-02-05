import { NextRequest, NextResponse } from 'next/server';
import { requireOrganizationId } from '@/lib/auth';
import { getStripeClient } from '@/lib/stripe';

/**
 * Get Current Subscription
 *
 * GET /api/stripe/subscription
 *
 * Returns the current active subscription for the organization
 */
export async function GET(req: NextRequest) {
  try {
    const organizationId = await requireOrganizationId();

    // TODO: Get subscription from database
    // const subscription = await db.query.subscriptions.findFirst({
    //   where: and(
    //     eq(subscriptions.organizationId, organizationId),
    //     eq(subscriptions.status, 'active')
    //   ),
    // });

    // For now, return placeholder
    return NextResponse.json({
      subscription: null,
      message: 'Subscription tracking not yet implemented',
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

/**
 * Cancel Subscription
 *
 * DELETE /api/stripe/subscription
 *
 * Cancels the subscription at the end of the current period
 *
 * Request body:
 * {
 *   "subscriptionId": "sub_xxx"
 * }
 */
export async function DELETE(req: NextRequest) {
  try {
    const organizationId = await requireOrganizationId();

    const body = await req.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing required field: subscriptionId' },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    }) as Stripe.Subscription;

    // TODO: Update database
    // await db.update(subscriptions)
    //   .set({
    //     cancelAtPeriodEnd: true,
    //     updatedAt: new Date(),
    //   })
    //   .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.current_period_end,
      },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to cancel subscription', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

/**
 * Update Subscription
 *
 * PATCH /api/stripe/subscription
 *
 * Updates the subscription (e.g., change plan)
 *
 * Request body:
 * {
 *   "subscriptionId": "sub_xxx",
 *   "priceId": "price_xxx"
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const organizationId = await requireOrganizationId();

    const body = await req.json();
    const { subscriptionId, priceId } = body;

    if (!subscriptionId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId and priceId' },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();

    // Get subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: 'create_prorations',
      }
    ) as Stripe.Subscription;

    // TODO: Update database
    // await db.update(subscriptions)
    //   .set({
    //     stripePriceId: priceId,
    //     updatedAt: new Date(),
    //   })
    //   .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

    return NextResponse.json({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        priceId: updatedSubscription.items.data[0].price.id,
        currentPeriodEnd: updatedSubscription.current_period_end,
      },
    });
  } catch (error) {
    console.error('Error updating subscription:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to update subscription', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
