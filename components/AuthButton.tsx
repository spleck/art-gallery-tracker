"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm">Loading...</span>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm hidden sm:inline">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
    >
      Sign in
    </button>
  );
}
