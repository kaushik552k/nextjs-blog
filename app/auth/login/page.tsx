"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/lib/actions";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please sign in to continue to the dashboard.
          </p>
        </div>

        <form action={dispatch} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="admin@kaushikcodes.in"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div>
            <LoginButton />
          </div>

          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <p className="text-sm text-red-500">⚠️ {errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}
