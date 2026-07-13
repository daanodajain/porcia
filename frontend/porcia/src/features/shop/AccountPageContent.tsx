"use client";

import { Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export function AccountPageContent() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="lux-h2">My Profile</h1>
        <p className="lux-lead">Welcome back, {user.firstName}.</p>
      </div>
      <Card className="p-8">
        <h3 className="lux-h3">Account Details</h3>
        <div className="mt-6 grid gap-4 border-t border-[var(--lux-border)] pt-6 md:grid-cols-2">
          <div>
            <p className="lux-small uppercase tracking-widest">Full Name</p>
            <p>{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="lux-small uppercase tracking-widest">Email Address</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="lux-small uppercase tracking-widest">Phone</p>
            <p>{user.phone}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}