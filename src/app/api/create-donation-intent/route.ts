import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, donorName, donorEmail } = await request.json();

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: {
        donorName: donorName || "Anonymous",
        donorEmail: donorEmail || "anonymous@example.com",
        type: "donation",
      },
      description: `Christmas Tree Donation - ${donorName || "Anonymous"}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating donation intent:", error);
    return NextResponse.json(
      { error: "Failed to create donation intent" },
      { status: 500 }
    );
  }
}
