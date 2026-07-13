import type { ReactNode } from "react";
import { PorciaThemeProvider } from "@/providers/ThemeProvider";
import { PorciaIntlProvider } from "@/providers/IntlProvider";
import { LenisProvider } from "@/animation/LenisProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PorciaThemeProvider>
      <PorciaIntlProvider>
        <AuthProvider>
          <CartProvider>
            <LenisProvider>{children}</LenisProvider>
          </CartProvider>
        </AuthProvider>
      </PorciaIntlProvider>
    </PorciaThemeProvider>
  );
}
