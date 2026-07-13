"use client";

import * as React from "react";
import { LoadingFallback } from "./LoadingFallback";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <LoadingFallback label={this.state.error.message ?? "Something went wrong"} />;
    }

    return this.props.children;
  }
}
