import { Cart, Checkout, Address, Payment, OrderSuccess } from "./index";

export const checkoutPhases = [Cart, Checkout, Address, Payment, OrderSuccess] as const;
