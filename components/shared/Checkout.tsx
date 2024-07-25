"use client";

import { memo, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";

import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const Checkout = memo(function Checkout({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) {
  const [toastId, setToastId] = useState<string | null>(null);
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // console.log("Search Params: ", searchParams.toString(), toast);
  // console.log("All toasts: ", toasts);

  if (toastId == null) {
    const status = searchParams.get("razorpay_payment_link_status");

    if (status === "paid") {
      console.log("Success toast is shown");
      const toastData = toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });

      setToastId(toastData.id);
    } else if (status === "failed") {
      // console.log("Error toast is shown");
      const toastData = toast({
        title: "Order Failed!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });

      setToastId(toastData.id);
    }

    router.push("/credits");
  }

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    // console.log("transaction: ", transaction);

    const paymentLinkResponse = await checkoutCredits(transaction);
    // console.log("paymentLinkResponse: ", paymentLinkResponse);

    if (paymentLinkResponse && paymentLinkResponse.short_url) {
      router.push(paymentLinkResponse.short_url);
    }
  };

  return (
    <form action={onCheckout} method="POST">
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
});

export default Checkout;
