import { createTransaction } from "@/lib/actions/transaction.action";
import { NextResponse } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: Request) {
  console.log("IM in Razorpay Webhook");

  const responseBody = await request.text();
  const sig = request.headers.get("x-razorpay-signature") as string;
  const endpointSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  // console.log({
  //   responseBody: JSON.stringify(JSON.parse(responseBody)),
  //   sig,
  //   endpointSecret,
  //   header: request.headers,
  // });

  try {
    const isValid = await validateWebhookSignature(
      JSON.stringify(JSON.parse(responseBody)),
      sig,
      endpointSecret
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(responseBody);
    const { event } = body;

    const {
      payload: { payment_link, payment },
    } = body;
    console.log("payment_link: ", payment_link);
    console.log("payment: ", payment);

    if (event && event === "payment_link.paid") {
      const { id, amount, notes, status } = payment?.entity;

      const transaction = {
        paymentId: id,
        amount: amount ? amount / 100 : 0,
        plan: notes?.plan || "",
        credits: notes?.credits || 0,
        buyerId: notes?.buyerId || "",
        createdAt: new Date(),
      };

      console.log("transaction: ", transaction);

      if (status === "captured") {
        const newTransaction = await createTransaction(transaction);

        console.log("newTransaction: ", newTransaction);

        return NextResponse.json({
          message: "OK",
          transaction: newTransaction,
        });
      } else {
        return NextResponse.json({
          message: "Payment is failed. Try Again.",
        });
      }
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
  }
}
