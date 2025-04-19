export const shouldShowNewCheckoutFlow = (isBStackIntegrationEnabled: boolean, isBStackCheckoutEnabled: boolean) => {
  if (!isBStackIntegrationEnabled) return false;

  if (isBStackCheckoutEnabled) return true;

  return false;
};

export const createBStackCheckoutUrl = (
  planName: string,
  quantity: number,
  isAnnual: boolean,
  sourceUrl: string
): string => {
  const searchParams = new URLSearchParams({
    source: sourceUrl,
    plan: planName,
    annual: isAnnual.toString(),
    quantity: quantity.toString(),
    product_type: "requestly",
  });

  return `${process.env.BROWSERSTACK_BASE_URL}/user/pricing-to-checkout?${searchParams.toString()}`;
};
