import express, { Router } from "express";
import Stripe from "stripe";

import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { db } from "@aca/db";
import { SubscriptionPlan, SwitchSubscriptionPlanOutput } from "@aca/gql";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2020-08-27" });

const PRICES = { premium: process.env.STRIPE_PRICE_PREMIUM_ID!, business: process.env.STRIPE_PRICE_BUSINESS_ID! };

export const switchSubscriptionPlanAction: ActionHandler<{ plan: SubscriptionPlan }, SwitchSubscriptionPlanOutput> = {
  actionName: "switch_subscription_plan",

  async handle(userId, { plan: planUpper }) {
    const plan = planUpper.toLowerCase() as Lowercase<typeof planUpper>;
    const user = await db.user.findUnique({ where: { id: userId } });
    assert(user, `missing user for id ${userId}`);

    // TODO this assertion needs to be removed when we enable the free plan
    assert(plan !== "free", `Tried to switch to free plan for user ${userId}`);

    assert(plan !== user.subscription_plan, `User ${userId} is already on a ${plan} subscription`);

    const checkedOutURL = `${process.env.FRONTEND_URL}/stripe/checked-out`;

    if (user.stripe_subscription_id) {
      // TODO when we leave the beta, and introduce the free plan as the new default, this needs to be changed
      // so that switching to premium also charges users
      if (plan == "premium") {
        await stripe.subscriptions.del(user.stripe_subscription_id);
        await db.user.update({
          where: { id: userId },
          data: { stripe_subscription_id: null, subscription_plan: "premium" },
        });
        return {};
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false,
        proration_behavior: "create_prorations",
        items: [{ id: subscription.items.data[0].id, price: PRICES[plan] }],
      });
      await db.user.update({ where: { id: userId }, data: { subscription_plan: plan } });

      return {};
    }

    // TODO enable assertion when we bring in the free plan
    // assert(plan !== "free", "No subscription found to cancel");

    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      stripeCustomerId = (await stripe.customers.create({ email: user.email, name: user.name })).id;
      await db.user.update({ where: { id: userId }, data: { stripe_customer_id: stripeCustomerId } });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      mode: "subscription",
      success_url: checkedOutURL + "?reason=success",
      cancel_url: checkedOutURL + "?reason=cancel",
    });
    assert(session.url, `Missing URL for session ${session.id}`);

    return { checkout_url: session.url };
  },
};

export const router = Router();

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const { customer } = subscription;
      if (!customer) {
        break;
      }
      const stripeCustomerId = typeof customer == "string" ? customer : customer.id;
      const isBusiness = subscription.items.data[0].price.id == PRICES.business;
      await db.user.update({
        where: { stripe_customer_id: stripeCustomerId },
        data: { stripe_subscription_id: subscription.id, subscription_plan: isBusiness ? "business" : "premium" },
      });
      break;
    }
  }
}

router.post("/v1/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];
  assert(typeof signature == "string", `missing signature for event ${JSON.stringify(req.body)}`);
  const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  try {
    await handleStripeEvent(event);
  } catch (error) {
    logger.error(error, `There was an error handling a stripe webhook event ${JSON.stringify(event)}`);
  }

  res.json({ received: true });
});
