import express, { Router } from "express";
import Stripe from "stripe";

import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { db } from "@aca/db";
import { SubscriptionPlan, SwitchSubscriptionPlanOutput } from "@aca/gql";
import { assert } from "@aca/shared/assert";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { logger } from "@aca/shared/logger";
import { routes } from "@aca/shared/routes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2020-08-27" });

export const switchSubscriptionPlanAction: ActionHandler<{ plan: SubscriptionPlan }, SwitchSubscriptionPlanOutput> = {
  actionName: "switch_subscription_plan",

  async handle(userId, { plan: planUpper }) {
    const plan = planUpper.toLowerCase() as Lowercase<typeof planUpper>;
    const user = await db.user.findUnique({ where: { id: userId } });
    assert(userId && user, `missing user for id ${userId}`);

    // TODO this assertion needs to be removed when we enable the free plan
    assert(plan !== "free", `Tried to switch to free plan for user ${userId}`);

    assert(plan !== user.subscription_plan, `User ${userId} is already on a ${plan} subscription`);

    const hasExistingSubscription = Boolean(user.stripe_subscription_id);
    if (hasExistingSubscription) {
      // TODO when we leave the beta, and introduce the free plan as the new default, this needs to be changed
      // so that switching to premium also charges users
      if (plan == "premium") {
        await stripe.setupIntents.cancel(user.stripe_subscription_id!);
        await Promise.all([
          db.user.update({
            where: { id: userId },
            data: { stripe_subscription_id: null, subscription_plan: "premium" },
          }),
          // Gmail is a ultimate plan feature, so we remove those integrations when someone disconnects
          db.gmail_account.deleteMany({ where: { account: { user_id: userId } } }),
        ]);
        trackBackendUserEvent(user.id, "Plan Downgraded", { plan_end_date: new Date(), plan_name: "premium" });
        return {};
      }

      // TODO: Once premium becomes a subscription as well, we need to support switching between premium and ultimate
    }

    // TODO enable assertion when we bring in the free plan
    // assert(plan !== "free", "No subscription found to cancel");

    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      stripeCustomerId = (await stripe.customers.create({ email: user.email, name: user.name })).id;
      await db.user.update({ where: { id: userId }, data: { stripe_customer_id: stripeCustomerId } });
    }

    const checkedOutURL = process.env.FRONTEND_URL + routes.stripeCheckedOut;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "setup",
      payment_method_types: ["card"],
      success_url: checkedOutURL + "?reason=success",
      cancel_url: checkedOutURL + "?reason=cancel",
    });
    assert(session.url, `Missing URL for session ${session.id}`);

    return { checkout_url: session.url };
  },
};

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "setup_intent.succeeded": {
      const subscription = event.data.object as Stripe.SetupIntent;
      const { customer } = subscription;
      if (!customer) {
        break;
      }
      const stripeCustomerId = typeof customer == "string" ? customer : customer.id;
      const user = await db.user.update({
        where: { stripe_customer_id: stripeCustomerId },
        data: { stripe_subscription_id: subscription.id, subscription_plan: "ultimate" },
      });
      trackBackendUserEvent(user.id, "Plan Upgraded", { plan_start_date: new Date(), plan_name: "ultimate" });
      break;
    }
  }
}

export const router = Router();

// Stripe needs to get the raw request to verify its signature
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
