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
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (toastId == null) {
    const status = searchParams.get("razorpay_payment_link_status");

    if (status === "paid") {
      const toastData = toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });

      setToastId(toastData.id);
    } else if (status === "failed") {
      const toastData = toast({
        title: "Order Failed!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });

      setToastId(toastData.id);
    }
  }

  useEffect(() => {
    if (toastId) {
      router.push("/profile");
    }
  }, [toastId]);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    const paymentLinkResponse = await checkoutCredits(transaction);

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
