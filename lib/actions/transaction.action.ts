"use server";
import Razorpay from "razorpay";
import Transaction from "../db/models/transaction.model";
import { connectToDatabase } from "../db/mongoose";
import { PaymentLinks } from "razorpay/dist/types/paymentLink";
import { updateCredits } from "./user.actions";
import { handleError } from "../utils";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const amount = Number(transaction.amount) * 100;

  const paymentLinkObj: PaymentLinks.RazorpayPaymentLinkCreateRequestBody = {
    amount: amount,
    currency: "USD",
    expire_by: new Date(Date.now() + 7 * 60 * 1000).getTime(),
    description: transaction.plan,
    notify: {
      sms: true,
      email: false,
    },
    customer: {
      name: "",
      email: "",
      contact: "",
    },
    reminder_enable: true,
    notes: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/credits`,
    callback_method: "get",
  };

  try {
    const paymentLink = await razorpay.paymentLink.create(paymentLinkObj);

    return JSON.parse(JSON.stringify(paymentLink));
  } catch (error) {
    console.log("Error creating payment link: ", error);
    handleError(error);
  }
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error: any) {
    console.log("Error creating transaction: ", error);
    handleError(error);
  }
}
