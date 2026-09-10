import React, { useState, useEffect } from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import { useToast } from "../../../contexts/ToastContext";
import { Button, Badge } from "../../../design/components";
import { ConfirmDialog } from "../../../design/components/overlay";
import {
  ButtonVariants,
  BadgeVariants,
  ComponentSizes,
} from "../../../design/constants";
import { IAccess, IProduct, ISubscription, ITransaction } from "..";
import { PaymentController } from "..";
import { formatLocalDate } from "../../../helpers";

export const PaymentPage: React.FC = () => {
  const { setLoading } = useLoading();
  const { success, error } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [accesses, setAccesses] = useState<IAccess[]>([]);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const [productsResult, subscriptionsResult, transactionsResult, accessesResult] =
      await Promise.all([
        PaymentController.getProducts(),
        PaymentController.getSubscriptions(),
        PaymentController.getTransactions(),
        PaymentController.getActiveAccesses(),
      ]);

    if (productsResult.success && productsResult.products) {
      setProducts(productsResult.products);
    }

    if (subscriptionsResult.success && subscriptionsResult.subscriptions) {
      setSubscriptions(subscriptionsResult.subscriptions);
    }

    if (transactionsResult.success && transactionsResult.transactions) {
      setTransactions(transactionsResult.transactions);
    }

    if (accessesResult.success && accessesResult.accesses) {
      setAccesses(accessesResult.accesses);
    }

    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleCheckout = async (productId: string) => {
    setLoading(true);
    const result = await PaymentController.createCheckout(productId);
    setLoading(false);

    if (result.success) {
      if (result.freeAccessGranted) {
        success("Free access claimed successfully! 🎉");
        await fetchData();
        return;
      }

      if (result.checkoutUrl) {
        success("Redirecting to checkout...");
        window.location.assign(result.checkoutUrl);
        return;
      }
    }

    error(result.error || "Failed to process checkout");
  };

  const handleCancel = async (subscriptionId: string) => {
    setLoading(true);
    const result = await PaymentController.cancelSubscription(subscriptionId);
    setLoading(false);

    if (result.success) {
      success(result.message || "Subscription canceled successfully");
      await fetchData();
    } else {
      error(result.error || "Failed to cancel subscription");
    }
  };

  const handleResume = async (subscriptionId: string) => {
    setLoading(true);
    const result = await PaymentController.resumeSubscription(subscriptionId);
    setLoading(false);

    if (result.success) {
      success(result.message || "Subscription resumed successfully");
      await fetchData();
    } else {
      error(result.error || "Failed to resume subscription");
    }
  };

  const getPurchaseCount = (productId: string) => {
    return transactions.filter((t) => t.product_id === productId && t.paid)
      .length;
  };

  const hasActiveAccess = (productId: string) => {
    return accesses.some((a) => a.product_id === productId && a.active);
  };

  const getActiveSubscription = (productId: string) => {
    return subscriptions.find(
      (s) => s.product_id === productId && s.active && !s.canceled_at,
    );
  };

  const getCanceledSubscription = (productId: string) => {
    return subscriptions.find(
      (s) =>
        s.product_id === productId &&
        s.active &&
        s.canceled_at && // scheduled for cancellation
        !s.ended_at,
    );
  };

  const getFullyCanceledSubscription = (productId: string) => {
    return subscriptions.find(
      (s) => s.product_id === productId && s.status === "canceled",
    );
  };

  const renderProductActions = (product: IProduct) => {
    const isFree = product.free || product.price_unit_amount === 0;
    const hasAccess = hasActiveAccess(product.id);
    const activeSub = getActiveSubscription(product.id);
    const canceledSub = getCanceledSubscription(product.id);
    const fullyCanceledSub = getFullyCanceledSubscription(product.id);
    const purchaseCount = getPurchaseCount(product.id);

    // Free Product Flow
    if (isFree) {
      if (hasAccess) {
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={BadgeVariants.SUCCESS} size={ComponentSizes.MD}>
                ✅ Free Access Claimed
              </Badge>
            </div>
            <Button
              variant={ButtonVariants.SECONDARY}
              fullWidth
              size={ComponentSizes.MD}
              disabled
            >
              Claimed
            </Button>
          </div>
        );
      }

      return (
        <Button
          variant={ButtonVariants.PRIMARY}
          fullWidth
          size={ComponentSizes.MD}
          onClick={() => handleCheckout(product.id)}
        >
          Claim Now
        </Button>
      );
    }

    // Active subscription
    if (activeSub) {
      const activeUntil = activeSub.current_period_end
        ? formatLocalDate(activeSub.current_period_end)
        : "end of period";

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={BadgeVariants.SUCCESS} size={ComponentSizes.MD}>
              ✅ Active Subscription
            </Badge>
          </div>
          <p className="text-xs text-base-content/60">
            Next billing: {activeUntil}
          </p>
          <Button
            variant={ButtonVariants.SECONDARY}
            fullWidth
            size={ComponentSizes.SM}
            onClick={() => setCancelTargetId(activeSub.id)}
          >
            Cancel Subscription
          </Button>
        </div>
      );
    }

    // Canceled but still active (scheduled for cancellation)
    if (canceledSub) {
      const activeUntil = canceledSub.current_period_end
        ? formatLocalDate(canceledSub.current_period_end)
        : "end of period";

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={BadgeVariants.WARNING} size={ComponentSizes.MD}>
              ⏳ Canceled (active until {activeUntil})
            </Badge>
          </div>
          <Button
            variant={ButtonVariants.SECONDARY}
            fullWidth
            size={ComponentSizes.SM}
            onClick={() => handleResume(canceledSub.id)}
          >
            Resume Subscription
          </Button>
        </div>
      );
    }

    // Fully canceled (ended) - can subscribe again
    if (fullyCanceledSub) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={BadgeVariants.ERROR} size={ComponentSizes.MD}>
              ❌ Subscription Ended
            </Badge>
          </div>
          <Button
            variant={ButtonVariants.PRIMARY}
            fullWidth
            size={ComponentSizes.MD}
            onClick={() => handleCheckout(product.id)}
          >
            Subscribe Again
          </Button>
        </div>
      );
    }

    // One-time paid product with active access
    if (!product.recurring && hasAccess) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={BadgeVariants.SUCCESS} size={ComponentSizes.MD}>
              ✅ Lifetime Access Active
            </Badge>
          </div>
          <Button
            variant={ButtonVariants.PRIMARY}
            fullWidth
            size={ComponentSizes.MD}
            onClick={() => handleCheckout(product.id)}
          >
            Buy Again
          </Button>
          {purchaseCount > 0 && (
            <p className="text-xs text-base-content/60 text-center">
              Purchased {purchaseCount} time{purchaseCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      );
    }

    // One-time paid product previously purchased
    if (!product.recurring && purchaseCount > 0) {
      return (
        <div className="space-y-3">
          <Button
            variant={ButtonVariants.PRIMARY}
            fullWidth
            size={ComponentSizes.MD}
            onClick={() => handleCheckout(product.id)}
          >
            Buy Again
          </Button>
          <p className="text-xs text-base-content/60 text-center">
            Purchased {purchaseCount} time{purchaseCount > 1 ? "s" : ""}
          </p>
        </div>
      );
    }

    // Available for purchase
    return (
      <Button
        variant={ButtonVariants.PRIMARY}
        fullWidth
        size={ComponentSizes.MD}
        onClick={() => handleCheckout(product.id)}
      >
        {product.recurring ? "Subscribe Now" : "Buy Now"}
      </Button>
    );
  };

  return (
    <>
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-primary text-base-content">
          Choose Your Plan
        </h1>
        <p className="text-body-m text-base-content/70">
          Select the option that works best for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-base-100/70 border border-base-300 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-primary/40 transition-colors"
          >
            <div>
              <h3 className="text-xl font-bold font-primary text-base-content">
                {product.name}
              </h3>
              <p className="text-body-s text-base-content/70 mt-1">
                {product.description}
              </p>

              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-base-content">
                  {product.price}
                </span>
                <span className="text-body-s text-base-content/60 ml-2">
                  {product.recurring
                    ? `/${product.period_label}`
                    : " (one-time)"}
                </span>
              </div>
            </div>

            <div>
              <div className="border-t border-base-300 my-4" />
              {renderProductActions(product)}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={cancelTargetId !== null}
        onClose={() => setCancelTargetId(null)}
        onConfirm={() => {
          if (cancelTargetId) {
            handleCancel(cancelTargetId);
            setCancelTargetId(null);
          }
        }}
        title="Cancel Subscription"
        message="Your subscription will remain active until the end of the billing period. Are you sure you want to cancel?"
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Subscription"
        isDestructive={true}
      />
    </>
  );
};

export default PaymentPage;
