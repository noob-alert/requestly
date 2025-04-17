export const shouldShowNewCheckoutFlow = (isBStackIntegrationEnabled: boolean, checkoutVariation: string) => {
  if (!isBStackIntegrationEnabled) return false;

  if (checkoutVariation === "browserstack") return true;

  return false;
};
