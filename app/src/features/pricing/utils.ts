import { RQBrowserstackPlanIdMap } from "./constants/pricingPlans";

export const shouldShowNewCheckoutFlow = (isBStackIntegrationEnabled: boolean, checkoutVariation: string) => {
  if (!isBStackIntegrationEnabled) return false;

  if (checkoutVariation === "browserstack") return true;

  return false;
};

export const createBStackCheckoutUrl = (
  planName: string,
  quantity: number,
  isAnnual: boolean,
  sourceUrl: string
): string => {
  const bstackPlan = RQBrowserstackPlanIdMap[planName];
  const searchParams = new URLSearchParams({
    source: sourceUrl,
    product_type: "requestly",
    plan: bstackPlan,
    quantity: quantity.toString(),
    annual: isAnnual.toString(),
  });

  return `${process.env.BROWSERSTACK_BASE_URL}/orders/new?${searchParams.toString()}`;
};
