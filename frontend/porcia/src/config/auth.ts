export const authStorage = {
  customerToken: "customerAuthToken",
  legacyCustomerToken: "authToken",
  adminToken: "adminAuthToken",
} as const;

export function getStoredCustomerToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(authStorage.customerToken) ??
    localStorage.getItem(authStorage.legacyCustomerToken)
  );
}

export function setStoredCustomerToken(token: string) {
  localStorage.setItem(authStorage.customerToken, token);
  localStorage.setItem(authStorage.legacyCustomerToken, token);
}

export function clearStoredCustomerToken() {
  localStorage.removeItem(authStorage.customerToken);
  localStorage.removeItem(authStorage.legacyCustomerToken);
}
