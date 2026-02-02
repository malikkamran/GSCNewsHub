import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route } from "wouter";
import React from "react";
import { isAuthorized } from "@/lib/auth-utils";

export function PartnerProtectedRoute({ path, component: Component }: { path: string; component: React.ComponentType<any> }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </Route>
    );
  }

  if (!isAuthorized(user, 'partner')) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
