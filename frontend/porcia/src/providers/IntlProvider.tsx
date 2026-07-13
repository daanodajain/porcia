"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
type Messages = ComponentProps<typeof NextIntlClientProvider>["messages"];

export function PorciaIntlProvider({
  children,
  locale = "en",
  messages = {} as Messages,
}: {
  children: ReactNode;
  locale?: string;
  messages?: Messages;
}) {
  return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
}
